import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { firstValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { FirebaseError } from '@angular/fire/app';
import { generateSearchKeywords } from '../../shared/functions/generate-search-keywords.function';
import { RoleService } from '../../shared/services/role.service';
import { UserRole } from '../../shared/enums/user-role.enum';
import { Role } from '../../shared/models/role.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardContent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './registration.page.html',
  styleUrl: './registration.page.scss',
})
export class RegistrationPage {
  registrationForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
      ]),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      residence: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+[.,]?(([ '-])[A-Za-zÀ-ÖØ-öø-ÿ0-9]+\.?)*$/),
      ]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService,
    private userService: UserService,
    private toast: HotToastService
  ) {}

  get isFormValid(): boolean {
    return this.registrationForm.valid;
  }

  register(): void {
    firstValueFrom(
      this.authService
        .register$(
          this.registrationForm.get('email')!.value!,
          this.registrationForm.get('password')!.value!
        )
        .pipe(
          this.toast.observe({
            loading: 'Registering...',
            success: () => {
              return 'Registration successful!';
            },
            error: err => {
              const { message } = err as FirebaseError;
              return 'Registration failed: ' + message;
            },
          })
        )
    )
      .then(async userCred => {
        const uid = userCred.user.uid;

        const user: User = {
          id: uid,
          name: this.registrationForm.get('name')!.value!,
          username: this.registrationForm.get('username')!.value!,
          email: this.registrationForm.get('email')!.value!,
          residence: this.registrationForm.get('residence')!.value!,
          usernameSearchKeywords: generateSearchKeywords(
            this.registrationForm.get('username')!.value!
          ),
          emailSearchKeywords: generateSearchKeywords(this.registrationForm.get('email')!.value!),
        };

        const role: Role = {
          id: uid,
          role: UserRole.User,
        };

        await this.userService.createUser(user);
        await this.roleService.createRole(role);

        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.log(error);
      });
  }
}

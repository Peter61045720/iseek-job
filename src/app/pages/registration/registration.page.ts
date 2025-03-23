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
  isLoading = false;

  registrationForm = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isFormValid(): boolean {
    return this.registrationForm.valid;
  }

  register(): void {
    // console.log(this.registrationForm.get('username')?.value);
    // console.log(this.registrationForm.get('email')?.value);
    // console.log(this.registrationForm.get('password')?.value);

    this.isLoading = true;

    this.authService
      .register(
        this.registrationForm.get('email')!.value!,
        this.registrationForm.get('password')!.value!
      )
      .then(userCred => {
        console.log(userCred);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

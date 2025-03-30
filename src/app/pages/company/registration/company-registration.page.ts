import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthService } from '../../../shared/services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { firstValueFrom } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-company-registration',
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
  ],
  templateUrl: './company-registration.page.html',
  styleUrl: './company-registration.page.scss',
})
export class CompanyRegistrationPage {
  contactForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

  // TODO Finish company registration form
  // companyForm = new FormGroup();

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  get isFormValid(): boolean {
    return this.contactForm.valid;
  }

  register(): void {
    firstValueFrom(
      this.authService
        .register$(this.contactForm.get('email')!.value!, this.contactForm.get('password')!.value!)
        .pipe(
          this.toast.observe({
            loading: 'Registering...',
            success: () => {
              return 'Registration successful!';
            },
            error: e => {
              const a = e as FirebaseError;
              return 'Registration failed: ' + a.message;
            },
          })
        )
    )
      .then(userCred => {
        // const contact: Contact = {};
        console.log(userCred);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.log(error);
      });
  }
}

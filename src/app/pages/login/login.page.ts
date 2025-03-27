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
import { HotToastService } from '@ngxpert/hot-toast';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  login() {
    // console.log(this.loginForm.get('email')?.value);
    // console.log(this.loginForm.get('password')?.value);

    firstValueFrom(
      this.authService
        .login(this.loginForm.get('email')!.value!, this.loginForm.get('password')!.value!)
        .pipe(
          this.toast.observe({
            loading: 'Bejelentkezés...',
            success: () => {
              this.router.navigateByUrl('/home');
              return 'Sikeres bejelentkezés!';
            },
            error: e => {
              console.error(e);
              return 'Sikertelen bejelentkezés!';
            },
          })
        )
    );
  }
}

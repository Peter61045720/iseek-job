import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {
    this.isLoading = true;

    this.authService.logout().then(() => {
      console.log('Logout was successful');
      this.router.navigateByUrl('/login');
      this.isLoading = false;
    });
  }
}

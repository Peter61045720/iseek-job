import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  viewProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

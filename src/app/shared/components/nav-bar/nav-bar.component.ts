import { NavItem } from './../../interfaces/nav-item.interface';
import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  navList: NavItem[];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.navList = [
      {
        label: 'Home',
        route: 'home',
      },
      {
        label: 'My Company',
        route: 'company/KdpqiVYbyNKM1wF7WPj9/overview',
      },
      {
        label: 'New Contact',
        route: 'contact-registration',
      },
    ];
  }

  viewProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(p => p.LoginPage),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./pages/registration/registration.page').then(p => p.RegistrationPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(p => p.HomePage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

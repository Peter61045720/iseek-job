import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(p => p.LoginPage)
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.page').then(p => p.RegistrationPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

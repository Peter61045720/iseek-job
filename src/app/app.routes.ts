import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/guest-layout/guest-layout.component').then(
        l => l.GuestLayoutComponent
      ),
    children: [
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
        path: 'company-registration',
        loadComponent: () =>
          import('./pages/company/registration/company-registration.page').then(
            p => p.CompanyRegistrationPage
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        l => l.MainLayoutComponent
      ),
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(p => p.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(p => p.ProfilePage),
      },
      {
        path: 'jobs',
        loadComponent: () => import('./pages/jobs/jobs.page').then(p => p.JobsPage),
      },
      {
        path: 'company/:id/overview',
        loadComponent: () =>
          import('./pages/company/overview/company-overview.page').then(p => p.CompanyOverviewPage),
      },
      {
        path: 'contact-registration',
        loadComponent: () =>
          import('./pages/contact/registration/contact-registration.page').then(
            p => p.ContactRegistrationPage
          ),
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./pages/applications/applications.page').then(p => p.ApplicationsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

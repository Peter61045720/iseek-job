import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';
import { UserRole } from './shared/enums/user-role.enum';

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
        path: 'jobs',
        loadComponent: () => import('./pages/jobs/jobs.page').then(p => p.JobsPage),
        canActivate: [roleGuard([UserRole.User])],
      },
      {
        path: 'job-management',
        loadComponent: () =>
          import('./pages/job-management/job-management.component').then(
            p => p.JobManagementComponent
          ),
        canActivate: [roleGuard([UserRole.Contact])],
      },
      {
        path: 'company/:id/overview',
        loadComponent: () =>
          import('./pages/company/overview/company-overview.page').then(p => p.CompanyOverviewPage),
        canActivate: [roleGuard([UserRole.Contact])],
      },
      {
        path: 'contact-registration',
        loadComponent: () =>
          import('./pages/contact/registration/contact-registration.page').then(
            p => p.ContactRegistrationPage
          ),
        canActivate: [roleGuard([UserRole.Contact])],
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./pages/applications/applications.page').then(p => p.ApplicationsPage),
        canActivate: [roleGuard([UserRole.Contact])],
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(p => p.ProfilePage),
        canActivate: [roleGuard([UserRole.User])],
      },
      {
        path: 'contact-profile',
        loadComponent: () =>
          import('./pages/profile/contact-profile/contact-profile.page').then(
            p => p.ContactProfilePage
          ),
        canActivate: [roleGuard([UserRole.Contact])],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

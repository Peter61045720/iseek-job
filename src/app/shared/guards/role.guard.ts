import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { UserRole } from '../enums/user-role.enum';
import { AuthService } from '../services/auth.service';
import { map, of, switchMap, take } from 'rxjs';

export const roleGuard =
  (allowedRoles: UserRole[]): CanActivateFn =>
  () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const roleService = inject(RoleService);

    return authService.getUserData$().pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          router.navigateByUrl('/login');
          return of(false);
        } else {
          return roleService.getRole$(user.uid).pipe(
            take(1),
            map(role => {
              if (allowedRoles.includes(role)) {
                return true;
              } else {
                router.navigateByUrl('/home');
                return false;
              }
            })
          );
        }
      })
    );
  };

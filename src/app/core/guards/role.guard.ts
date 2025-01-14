import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: number) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentUserRole() === allowedRole) {
    return true;
  }

  return router.parseUrl('/unauthorized');
};
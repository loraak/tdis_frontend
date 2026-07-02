import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole === 'admin' && !auth.isAdmin()) {
    router.navigate(['/alumno/progreso']);
    return false;
  }

  if (requiredRole === 'alumno' && auth.isAdmin()) {
    router.navigate(['/admin/resumen']);
    return false;
  }

  return true;
};

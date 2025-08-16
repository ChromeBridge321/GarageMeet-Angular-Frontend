import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está logueado, redirigir al panel o página principal
  if (authService.isLoggedIn()) {
    // Si es admin, redirigir al panel, sino a la página principal
    const userType = authService.getUserType();
    if (userType === 'Admin') {
      router.navigate(['/panel']);
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  // Si no está logueado, permitir acceso a login/register
  return true;
};

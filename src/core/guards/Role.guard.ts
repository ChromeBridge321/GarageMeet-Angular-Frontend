import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar si el usuario está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/cuenta/iniciar-sesion']);
    return false;
  }
  
  // Obtener el tipo de usuario
  const userType = authService.getUserType();
  
  // Obtener los roles permitidos de la configuración de la ruta
  const allowedRoles = route.data?.['roles'] || ['Admin'];
  
  // Verificar si el usuario tiene uno de los roles permitidos
  if (!userType || !allowedRoles.includes(userType)) {
    // Redirigir a una página de acceso denegado o a la página principal
    router.navigate(['/']);
    return false;
  }
  
  return true;
};

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { map, take, filter, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { SubscriptionService } from '../services/Subscription.service';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  // Si no hay estado de suscripción, cargar primero
  const currentStatus = subscriptionService.getCurrentSubscriptionStatus();
  if (currentStatus === null) {
    subscriptionService.getSubscriptionStatus().subscribe();
  }

  return subscriptionService.subscriptionStatus$.pipe(
    filter(status => status !== null), // Esperar hasta que tengamos un estado válido
    take(1),
    timeout(5000), // Timeout de 5 segundos
    map(status => {
      if (status?.can_access_dashboard) {
        return true;
      } else {
        // Redirigir al panel con un parámetro de query para mostrar el mensaje
        router.navigate(['/panel'], {
          queryParams: {
            message: 'subscription_required',
            attempted_route: state.url
          }
        });
        return false;
      }
    }),
    catchError(() => {
      // En caso de error, permitir acceso y manejar en el backend
      console.warn('Error checking subscription status, allowing access');
      return of(true);
    })
  );
};

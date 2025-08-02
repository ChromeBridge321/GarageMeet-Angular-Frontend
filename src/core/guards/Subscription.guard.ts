import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SubscriptionService } from '../services/Subscription.service';
export const subscriptionGuard: CanActivateFn = (route, state) => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  return subscriptionService.subscriptionStatus$.pipe(
    take(1),
    map(status => {
      if (status?.can_access_dashboard) {
        return true;
      } else {
        messageService.add({
          severity: 'warn',
          summary: 'Suscripción requerida',
          detail: 'Necesitas una suscripción activa para acceder a esta función'
        });
        router.navigate(['/panel']);
        return false;
      }
    })
  );
};

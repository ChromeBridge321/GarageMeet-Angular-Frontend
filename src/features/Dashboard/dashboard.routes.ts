import { Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { SubscriptionManagementComponent } from './SubscriptionManagement/SubscriptionManagement.component';
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: 'clientes',
        loadChildren: () => import('./clientes/clientes.routes'),
      },
      {
        path: 'empleados',
        loadChildren: () => import('./empleados/empleados.routes'),
      },
      {
        path: 'cargos',
        loadChildren: () => import('./cargos/cargos.routes'),
      },
      {
        path: 'taller',
        loadChildren: () => import('./taller/taller.routes'),
      },
      {
        path: 'metodos-pago',
        loadChildren: () => import('./PaymentMethods/paymentMethods.routes'),
      },
      {
        path: 'tipos-pago',
        loadChildren: () => import('./payment-types/payment-types.routes'),
      },
      {
        path: 'piezas',
        loadChildren: () => import('./pieces/pieces.routes'),
      },
      {
        path: 'servicios',
        loadChildren: () => import('./services/services.routes'),
      },
      {
        path: 'ventas',
        loadChildren: () => import('./sales/sales.routes'),
      },
      {
        path: 'citas',
        loadChildren: () => import('./appointments/appointments.routes'),
      },
      {
        path: 'suscripcion',
        component: SubscriptionManagementComponent
      },
      {
        path: '**',
        redirectTo: 'panel'
      }
    ]
  }
];

export default dashboardRoutes;

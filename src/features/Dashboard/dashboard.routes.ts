import { Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { AddPaymentMethodComponent } from './AddPaymentMethod/AddPaymentMethod.component';
import { ListPaymentMethodsComponent } from './ListPaymentMethods/ListPaymentMethods.component';
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
        path: 'agregar-metodos-pago',
        component: AddPaymentMethodComponent
      },
      {
        path: 'listar-metodos-pago',
        component: ListPaymentMethodsComponent
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

import { Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
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
        path: '**',
        redirectTo: 'panel'
      }
    ]
  }
];

export default dashboardRoutes;

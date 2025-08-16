import { Routes } from '@angular/router';

export const servicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar/listar.component').then(m => m.ListarComponent),
  }
];

export default servicesRoutes;

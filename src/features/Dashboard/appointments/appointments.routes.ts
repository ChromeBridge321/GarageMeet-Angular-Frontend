import { Routes } from '@angular/router';

const appointmentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'listar',
    pathMatch: 'full'
  },
  {
    path: 'listar',
    loadComponent: () => import('./listar/listar.component').then(m => m.ListarAppointmentsComponent)
  }
];

export default appointmentsRoutes;

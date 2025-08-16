import { Routes } from '@angular/router';

export const piecesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./listar/listar.component').then(m => m.ListarComponent),
  }
];

export default piecesRoutes;

import { Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { CrearComponent } from './crear/crear.component';

export const salesRoutes: Routes = [
  {
    path: '',
    component: ListarComponent
  }
  ,
  {
    path: 'crear',
    component: CrearComponent
  }
];

export default salesRoutes;

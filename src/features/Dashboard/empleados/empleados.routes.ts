import { Route } from "@angular/router";
import { ListarComponent } from "./listar/listar.component";
import { CrearComponent } from "./crear/crear.component";
import { EditarComponent } from "./editar/editar.component";

export const empleadosRoutes: Route[] = [
  {
    path: '',
    component: ListarComponent
  },
  {
    path: 'crear',
    component: CrearComponent
  },
  {
    path: 'editar/:id',
    component: EditarComponent
  }
];

export default empleadosRoutes;

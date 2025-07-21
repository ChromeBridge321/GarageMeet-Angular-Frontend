import { Route } from "@angular/router";
import { ListarComponent } from "./listar/listar.component";
import { CrearComponent } from "./crear/crear.component";

export const empleadosRoutes: Route[] = [
  {
    path: '',
    component: ListarComponent
  },
  {
    path: 'crear',
    component: CrearComponent
  }
];

export default empleadosRoutes;

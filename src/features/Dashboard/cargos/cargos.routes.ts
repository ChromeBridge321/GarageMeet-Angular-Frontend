import { Routes } from "@angular/router";
import { ListarComponent } from "./listar/listar.component";
import { CrearComponent } from "./crear/crear.component";

export const CargosRoutes: Routes = [
  {
    path: '',
    component: ListarComponent
  },
  {
    path: 'crear',
    component: CrearComponent
  }
];
export default CargosRoutes;

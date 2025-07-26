import { Route } from "@angular/router";
import { ClientesComponent } from "./listar/clientes.component";
import { CrearComponent } from "./crear/crear.component";
import { VehiculosComponent } from "./vehiculos/listar/vehiculos.component";
import { EditarComponent } from "./editar/editar.component";
export const clientesRoutes: Route[] = [
  {
    path: '',
    component: ClientesComponent
  },
  {
    path: 'crear',
    component: CrearComponent
  },
  {
    path: 'vehiculos',
    component: VehiculosComponent
  }
  ,
  {
    path: 'editar/:id',
    component: EditarComponent
  }
];

export default clientesRoutes;

import { Route } from "@angular/router";
import { ClientesComponent } from "./listar/clientes.component";
import { CrearComponent } from "./crear/crear.component";
import { VehiculosComponent } from "./vehiculos/listar/vehiculos.component";
import { EditarComponent } from "./editar/editar.component";
import { subscriptionGuard } from "../../../core/guards/Subscription.guard";
export const clientesRoutes: Route[] = [
  {
    path: '',
    component: ClientesComponent
  },
  {
    path: 'crear',
    component: CrearComponent,
    canActivate: [subscriptionGuard]
  },
  {
    path: 'vehiculos',
    component: VehiculosComponent
  }
  ,
  {
    path: 'editar/:id',
    component: EditarComponent,
    canActivate: [subscriptionGuard]
  }
];

export default clientesRoutes;

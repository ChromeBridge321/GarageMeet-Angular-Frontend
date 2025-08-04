import { Route } from "@angular/router";
import { ListarComponent } from "./listar/listar.component";
import { CrearComponent } from "./crear/crear.component";
import { EditarComponent } from "./editar/editar.component";
import { subscriptionGuard } from "../../../core/guards/Subscription.guard";

export const empleadosRoutes: Route[] = [
  {
    path: '',
    component: ListarComponent
  },
  {
    path: 'crear',
    component: CrearComponent,
    canActivate: [subscriptionGuard]
  },
  {
    path: 'editar/:id',
    component: EditarComponent,
    canActivate: [subscriptionGuard]
  }
];

export default empleadosRoutes;

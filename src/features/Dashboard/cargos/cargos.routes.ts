import { Routes } from "@angular/router";
import { ListarComponent } from "./listar/listar.component";
import { CrearComponent } from "./crear/crear.component";
import { subscriptionGuard } from "../../../core/guards/Subscription.guard";

export const CargosRoutes: Routes = [
  {
    path: '',
    component: ListarComponent
  },
  {
    path: 'crear',
    component: CrearComponent,
    canActivate: [subscriptionGuard]
  }
];
export default CargosRoutes;

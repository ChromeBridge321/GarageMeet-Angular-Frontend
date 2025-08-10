import { Routes } from "@angular/router";
import { ListarPaymentTypesComponent } from "./listar/listar.component";
import { subscriptionGuard } from "../../../core/guards/Subscription.guard";

export const PaymentTypesRoutes: Routes = [
  {
    path: '',
    component: ListarPaymentTypesComponent
  }
];

export default PaymentTypesRoutes;

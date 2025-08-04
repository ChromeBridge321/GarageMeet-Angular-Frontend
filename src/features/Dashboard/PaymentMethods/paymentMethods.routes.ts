import { Route } from "@angular/router";
import { ListPaymentMethodsComponent } from "./ListPaymentMethods/ListPaymentMethods.component";
import { AddPaymentMethodComponent } from "./AddPaymentMethod/AddPaymentMethod.component";

export const paymentMethodsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'listar',
        component: ListPaymentMethodsComponent
      },

      {
        path: 'agregar',
        component: AddPaymentMethodComponent
      },
      {
        path: '**',
        redirectTo: ''
      },

    ]
  }
];
export default paymentMethodsRoutes;

import { Route } from "@angular/router";
import { TallerComponent } from "./taller.component";

export const tallerRoutes: Route[] = [
  {
    path: '',
    component: TallerComponent,
    children: [
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];

export default tallerRoutes;

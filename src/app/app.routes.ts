import { Routes } from '@angular/router';
import { PresentationComponent } from './GarageMeet/pages/presentation/presentation.component';
import { PruebasComponent } from './GarageMeet/pages/Pruebas/pruebas/pruebas.component';
import { SearchComponent } from './GarageMeet/pages/search/search.component';
export const routes: Routes = [
  {
    path: '',
    component: PresentationComponent
  },

  {
    path: 'pruebas',
    component: PruebasComponent
  },

  {
    path: 'search',
    component: SearchComponent
  },


  {
    path: '**',
    redirectTo:'',

  }
];

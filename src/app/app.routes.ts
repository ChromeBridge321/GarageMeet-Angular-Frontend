import { Routes } from '@angular/router';
import { PresentationComponent } from '../features/presentation/presentation.component';
import { PruebasComponent } from '../features/pruebas/pruebas.component';
import { SearchComponent } from '../features/search/search.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { PanelComponent } from '../features/Dashboard/panel/panel.component';
import { authGuard } from '../core/guards/authGuard.guard';
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
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'panel',
    canActivate: [authGuard],
    component: PanelComponent
  },

  {
    path: '**',
    redirectTo: '',

  }
];

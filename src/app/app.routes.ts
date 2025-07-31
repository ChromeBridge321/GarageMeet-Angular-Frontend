import { Routes } from '@angular/router';
import { PresentationComponent } from '../features/presentation/presentation.component';
import { PruebasComponent } from '../features/pruebas/pruebas.component';
import { SearchComponent } from '../features/search/search.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { PanelComponent } from '../features/Dashboard/panel/panel.component';
import { authGuard } from '../core/guards/authGuard.guard';
import { roleGuard } from '../core/guards/Role.guard';
import { guestGuard } from '../core/guards/guest.guard';
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
    component: LoginComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'panel',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('../features/Dashboard/dashboard.routes'),
  },

  {
    path: '**',
    redirectTo: '',

  }
];

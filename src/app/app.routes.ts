import { Routes } from '@angular/router';
import { PresentationComponent } from '../features/presentation/presentation.component';
import { PruebasComponent } from '../features/pruebas/pruebas.component';
import { SearchComponent } from '../features/search/search.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { PanelComponent } from '../features/Dashboard/panel/panel.component';
import { TallerComponent } from '../features/Dashboard/taller/taller.component';
import { ClientesComponent } from '../features/Dashboard/clientes/clientes.component';
import { EmpleadosComponent } from '../features/Dashboard/empleados/empleados.component';
import { CargosComponent } from '../features/Dashboard/cargos/cargos.component';
import { VehiculosComponent } from '../features/Dashboard/vehiculos/vehiculos.component';
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
    path: 'panel/taller',
    canActivate: [authGuard],
    component: TallerComponent
  },

  {
    path: 'panel/clientes',
    canActivate: [authGuard],
    component: ClientesComponent
  },

  {
    path: 'panel/empleados',
    canActivate: [authGuard],
    component: EmpleadosComponent
  },

  {
    path: 'panel/cargos',
    canActivate: [authGuard],
    component: CargosComponent
  },

  {
    path: 'panel/vehiculos',
    canActivate: [authGuard],
    component: VehiculosComponent
  },

  {
    path: '**',
    redirectTo: '',
  }
];

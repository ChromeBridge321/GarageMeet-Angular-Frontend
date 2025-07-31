import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { PanelMenu } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-panel',
  imports: [DrawerModule,
    ButtonModule,
    Menubar,
    PanelMenu,
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenuModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent implements OnInit {
  items: MenuItem[] | undefined;
  visible1: boolean = false;
  itemsMenu: MenuItem[] | undefined;
  authService = inject(AuthService);
  ngOnInit() {
    this.items = [
    ];
    this.itemsMenu = [
      {
        label: 'Taller',
        icon: 'pi pi-warehouse',
        items: [
          {
            label: 'Información',
            icon: 'pi pi-file-edit',
            routerLink: './taller',
          },
        ]
      },
      {
        label: 'Cargos',
        icon: 'pi pi-briefcase',
        routerLink: './cargos',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-align-justify',
            routerLink: './cargos',
          }
        ]
      },
      {
        label: 'Empleados',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-align-justify',
            routerLink: './empleados',
          },
          {
            label: 'Registrar',
            icon: 'pi pi-pen-to-square',
            routerLink: './empleados/crear',
          },
        ]
      },
      {
        label: 'Clientes',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-align-justify',
            routerLink: './clientes',
          },
          {
            label: 'Registrar',
            icon: 'pi pi-pen-to-square',
            routerLink: './clientes/crear',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: './clientes/vehiculos',
          },
        ]
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        styleClass: 'text-red-500',
        items: [
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout()
          }
        ]
      }

    ]
  }
}




import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuModule } from 'primeng/menu';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-panel',
  imports: [DrawerModule,
    ButtonModule,
    Menubar,
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenuModule,
    Toast,
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
  providers: [MessageService]
})
export class PanelComponent implements OnInit {
  items: MenuItem[] | undefined;
  visible1: boolean = false;
  itemsMenu: MenuItem[] | undefined;
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  ngOnInit() {
    // Verificar si hay mensajes en los query parameters
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'subscription_required') {
        this.messageService.add({
          severity: 'warn',
          summary: 'Suscripción requerida',
          detail: 'Necesitas una suscripción activa para acceder a esta función. Consulta nuestros planes de suscripción.',
          life: 5000
        });
      }
    });

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
        label: 'Citas',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Administrar Citas',
            icon: 'pi pi-calendar',
            routerLink: '/panel/citas',
          }
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
        label: 'Tipos de Pago',
        icon: 'pi pi-money-bill',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-align-justify',
            routerLink: './tipos-pago',
          }
        ]
      },
      {
        label: 'Piezas',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Gestión de Piezas',
            icon: 'pi pi-list',
            routerLink: './piezas',
          }
        ]
      },
      {
        label: 'Servicios',
        icon: 'pi pi-wrench',
        items: [
          {
            label: 'Gestión de Servicios',
            icon: 'pi pi-list',
            routerLink: './servicios',
          }
        ]
      },
      {
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        items: [
          {
            label: 'Gestión de Ventas',
            icon: 'pi pi-list',
            routerLink: './ventas',
          }
        ]
      },
      {
        label: 'Suscripción',
        icon: 'pi pi-bell',
        items: [
          {
            label: 'Administrar Suscripción',
            icon: 'pi pi-cog',
            routerLink: '/panel/suscripcion',
          }
        ]
      },
      {
        label: 'Metodos de Pago',
        icon: 'pi pi-credit-card',
        items: [
          {
            label: 'Agregar Metodo de Pago',
            icon: 'pi pi-plus',
            routerLink: '/panel/metodos-pago/agregar',
          },
          {
            label: 'Listado de Metodos de Pago',
            icon: 'pi pi-list',
            routerLink: '/panel/metodos-pago/listar',
          }
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
      },

    ]
  }
}




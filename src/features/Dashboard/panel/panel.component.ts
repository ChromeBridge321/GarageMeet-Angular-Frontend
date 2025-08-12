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
import { TieredMenu } from 'primeng/tieredmenu';
import { Menu } from 'primeng/menu';
@Component({
  selector: 'app-panel',
  imports: [DrawerModule,
    ButtonModule,
    Menubar,
    CommonModule,
    RouterOutlet,
    RouterLink,
    Menu,
    Toast,
    TieredMenu
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
      {
        label: 'Taller',
        routerLink: './taller'
      },
      {
        label: 'Administrar Suscripción',
        routerLink: '/panel/suscripcion',
      },

      {
        label: 'Listado de Metodos de Pago',
        routerLink: '/panel/metodos-pago/listar',
      },
      {
        separator: true
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      },

    ];
    this.itemsMenu = [
      {
        separator: true
      },
      {
        label: 'Citas',
        icon: 'pi pi-calendar',
        routerLink: '/panel/citas',

      },
      {
        separator: true
      },
      {
        label: 'Cargos',
        icon: 'pi pi-briefcase',
        routerLink: './cargos',

      },
      {
        separator: true
      },
      {
        label: 'Empleados',
        icon: 'pi pi-users',
        routerLink: './empleados',
      },
      {
        separator: true
      },
      {
        label: 'Clientes',
        icon: 'pi pi-user',
        routerLink: './clientes',

      },
      {
        separator: true
      },
      {
        label: 'Vehiculos',
        icon: 'pi pi-car',
        routerLink: './clientes/vehiculos',
      },
      {
        separator: true
      },

      {
        label: 'Tipos de Pago',
        icon: 'pi pi-money-bill',
        routerLink: './tipos-pago',

      },
      {
        separator: true
      },
      {
        label: 'Piezas',
        icon: 'pi pi-cog',
        routerLink: './piezas',

      },
      {
        separator: true
      },
      {
        label: 'Servicios',
        icon: 'pi pi-wrench',
        routerLink: './servicios',

      },
      {
        separator: true
      },
      {
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        routerLink: './ventas',
      },
      {
        separator: true
      },
    ]
  }
}




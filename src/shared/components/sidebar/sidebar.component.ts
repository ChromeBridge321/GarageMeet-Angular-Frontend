import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    DrawerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  // Control de la sidebar móvil
  sidebarVisible = signal(false);

  // Opciones de navegación
  navigationItems = signal([
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/panel',
      active: false
    },
    {
      label: 'Taller',
      icon: 'pi pi-wrench',
      route: '/panel/taller',
      active: false
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      route: '/panel/clientes',
      active: false
    },
    {
      label: 'Empleados',
      icon: 'pi pi-user-plus',
      route: '/panel/empleados',
      active: false
    },
    {
      label: 'Cargos',
      icon: 'pi pi-briefcase',
      route: '/panel/cargos',
      active: false
    },
    {
      label: 'Vehículos',
      icon: 'pi pi-car',
      route: '/panel/vehiculos',
      active: false
    }
  ]);

  constructor(private router: Router) {
    this.setActiveNavItemByRoute();
  }

  // Métodos para la sidebar
  toggleSidebar() {
    this.sidebarVisible.set(!this.sidebarVisible());
  }

  closeSidebar() {
    this.sidebarVisible.set(false);
  }

  setActiveNavItem(selectedItem: any) {
    const items = this.navigationItems();
    items.forEach(item => item.active = false);
    selectedItem.active = true;
    this.navigationItems.set([...items]);
    this.sidebarVisible.set(false);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  private setActiveNavItemByRoute() {
    const currentRoute = this.router.url;
    const items = this.navigationItems();
    items.forEach(item => {
      item.active = item.route === currentRoute;
    });
    this.navigationItems.set([...items]);
  }
}

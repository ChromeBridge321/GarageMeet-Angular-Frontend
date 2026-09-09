import { Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-nav',
  imports: [Menubar, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['nav.component.css'],
})
export class NavComponent implements OnInit {
  items: MenuItem[] | undefined;
  style = {
    'border': 'none !important',
  };
  authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        command: () => this.scrollToSection('Inicio'),
        fragment: 'Inicio'
      },
      {
        label: 'Nosotros',
        command: () => this.scrollToSection('Nosotros'),
        fragment: 'Nosotros'
      },
      {
        label: 'Planes',
        routerLink: '/pricing',
      },
      {
        label: 'Talleres',
        routerLink: '/search'
      },
      {
        label: 'Contacto',
        command: () => this.scrollToSection('Contacto'),
        fragment: 'Contacto'
      },
      {
        label: 'Panel',
        routerLink: '/panel',
        visible: this.authService.isLoggedIn() && this.authService.getUserType() === 'Admin'
      },
      {
        label: 'Iniciar Sesión',
        routerLink: '/login',
        icon: 'pi pi-sign-in',
        visible: !this.authService.isLoggedIn()
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        visible: this.authService.isLoggedIn() && this.authService.getUserType() == 'User',
        command: () => this.authService.logout()

      }
    ];
  }

  onCustomItemClick(event: MouseEvent, item: MenuItem): void {
    if (item.command && !item.routerLink) {
      event.preventDefault();
      event.stopPropagation();
      item.command({ originalEvent: event, item });
    }
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
      return;
    }

    // Las secciones solo existen en la portada. Desde otras rutas primero
    // volvemos a ella y después desplazamos hasta el fragmento solicitado.
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  onLogoClick(event: MouseEvent): void {
    event.preventDefault();
    this.scrollToSection('Inicio');
  }
}

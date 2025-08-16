import { Component, inject, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        command: () => this.scrollToSection('Inicio')
      },
      {
        label: 'Nosotros',
        command: () => this.scrollToSection('Nosotros')
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
        command: () => this.scrollToSection('Contacto')
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
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura aproximada del navbar
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }
}


import { Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [Menubar, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['nav.component.css'],
})
export class NavComponent implements OnInit {
  items: MenuItem[] | undefined;
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
        command: () => this.scrollToSection('Planes')
      },
      {
        label: 'Talleres',
        routerLink:'/search'
      },
      {
        label: 'Iniciar sesión',
        icon: 'pi pi-sign-in',
        routerLink:'/login'
      },
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


import { Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-nav',
  imports: [Menubar,RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  items: MenuItem[] | undefined;
  classes: object | undefined;
  styleClass: string | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Talleres',
        routerLink:'/search'
      },
      {
        label: 'Nosotros',
        url:"#Nosotros"
      },
      {
        label: 'Planes',
        url:"#Planes"
      },
      {
        label: 'Inicio',
        url:"#Inicio"
      },
      {
        label: 'Iniciar sesión',
        icon: 'pi pi-sign-in',
      },
    ];

    this.classes = {
      background: '#000000',
      border: 'none',
      borderRadius: '0%'
    };
  }
}


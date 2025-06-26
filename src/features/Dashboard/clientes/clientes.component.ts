import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-clientes',
  imports: [
    CommonModule,
    DashboardLayoutComponent
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

}

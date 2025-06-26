import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-vehiculos',
  imports: [
    CommonModule,
    DashboardLayoutComponent
  ],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-taller',
  imports: [
    CommonModule,
    DashboardLayoutComponent
  ],
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css']
})
export class TallerComponent {

}

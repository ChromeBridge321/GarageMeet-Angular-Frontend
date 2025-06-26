import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserSectionComponent } from '../user-section/user-section.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule,
    SidebarComponent,
    UserSectionComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {

}

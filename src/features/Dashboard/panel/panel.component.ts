import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-panel',
  imports: [
    CommonModule,
    DashboardLayoutComponent
  ],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Aquí puedes cargar datos reales del servicio cuando sea necesario
  }
}

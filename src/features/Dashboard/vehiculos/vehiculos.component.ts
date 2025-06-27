import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import { Client } from '../../../core/models/client.model';
import { Vehicle } from '../../../core/models/vehicle.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vehiculos',
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  // Signals para el estado
  vehicles = signal<Vehicle[]>([]);
  loading = signal(false);

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.loading.set(true);

    const workshopId = this.authService.getWorkshopId();
    if (!workshopId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la información del taller'
      });
      this.loading.set(false);
      return;
    }

    // Cargar clientes y extraer sus vehículos
    this.clientService.getAllClients({
      mechanical_workshops_id: workshopId
    }).subscribe({
      next: (clients) => {
        const allVehicles: Vehicle[] = [];

        clients.forEach(client => {
          if (client.vehicles && client.vehicles.length > 0) {
            client.vehicles.forEach(vehicle => {
              allVehicles.push({
                ...vehicle,
                client: {
                  clients_id: client.clients_id,
                  mechanical_workshops_id: client.mechanical_workshops_id,
                  peoples_id: client.peoples_id,
                  person: client.person
                }
              } as Vehicle);
            });
          }
        });

        this.vehicles.set(allVehicles);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los vehículos'
        });
        this.loading.set(false);
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  }

  getClientName(vehicle: Vehicle): string {
    if (!vehicle.client?.person) return 'Cliente no encontrado';
    return `${vehicle.client.person.name} ${vehicle.client.person.last_name}`;
  }

  getClientContact(vehicle: Vehicle): string {
    if (!vehicle.client?.person) return 'N/A';
    return vehicle.client.person.cellphone_number || 'Sin teléfono';
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { ClientService } from '../../../core/services/client.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  DeleteClientRequest,
  Vehicle
} from '../../../core/models/client.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccordionModule } from 'primeng/accordion';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-clientes',
  imports: [
    CommonModule,
    FormsModule,
    DashboardLayoutComponent,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    AccordionModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  // Signals para el estado
  clients = signal<Client[]>([]);
  loading = signal(false);

  // Dialog states
  clientDialogVisible = false;
  isEditing = signal(false);

  // Form data
  currentClient: Partial<CreateClientRequest & UpdateClientRequest> = {};
  currentVehicle: Partial<Vehicle> = {};

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
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

    this.clientService.getAllClients({
      mechanical_workshops_id: workshopId
    }).subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los clientes'
        });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.currentClient = {};
    this.currentVehicle = {};
    this.isEditing.set(false);
    this.clientDialogVisible = true;
  }

  editClient(client: Client) {
    this.currentClient = {
      name: client.person?.name || '',
      last_name: client.person?.last_name || '',
      email: client.person?.email || '',
      cellphone_number: client.person?.cellphone_number || '',
      peoples_id: client.peoples_id,
      clients_id: client.clients_id,
      vehicle: client.vehicles || []
    };

    // Si hay vehículos, tomar el primero para edición
    if (client.vehicles && client.vehicles.length > 0) {
      this.currentVehicle = { ...client.vehicles[0] };
    } else {
      this.currentVehicle = {};
    }

    this.isEditing.set(true);
    this.clientDialogVisible = true;
  }

  deleteClient(client: Client) {
    const fullName = client.person
      ? `${client.person.name} ${client.person.last_name}`
      : `Cliente ID: ${client.clients_id}`;

    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar al cliente "${fullName}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const deleteRequest: DeleteClientRequest = {
          peoples_id: client.peoples_id,
          clients_id: client.clients_id
        };

        this.clientService.deleteClient(deleteRequest).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente eliminado correctamente'
            });
            this.loadClients();
          },
          error: (error) => {
            console.error('Error deleting client:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el cliente'
            });
          }
        });
      }
    });
  }

  saveClient() {
    // Validaciones
    if (!this.currentClient.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El nombre es requerido'
      });
      return;
    }

    if (!this.currentClient.last_name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El apellido es requerido'
      });
      return;
    }

    if (!this.currentClient.email?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El email es requerido'
      });
      return;
    }

    if (!this.currentClient.cellphone_number?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El número de teléfono es requerido'
      });
      return;
    }

    // Validaciones del vehículo
    if (!this.currentVehicle.plates?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Las placas del vehículo son requeridas'
      });
      return;
    }

    if (!this.currentVehicle.model?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El modelo del vehículo es requerido'
      });
      return;
    }

    if (!this.currentVehicle.make?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La marca del vehículo es requerida'
      });
      return;
    }

    if (this.isEditing()) {
      // Update
      const updateRequest: UpdateClientRequest = {
        name: this.currentClient.name!.trim(),
        last_name: this.currentClient.last_name!.trim(),
        email: this.currentClient.email!.trim(),
        cellphone_number: this.currentClient.cellphone_number!.trim(),
        peoples_id: this.currentClient.peoples_id!,
        clients_id: this.currentClient.clients_id!,
        vehicle: [{
          vehicles_id: this.currentVehicle.vehicles_id,
          plates: this.currentVehicle.plates!.trim(),
          model: this.currentVehicle.model!.trim(),
          make: this.currentVehicle.make!.trim()
        }]
      };

      this.clientService.updateClient(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente'
          });
          this.clientDialogVisible = false;
          this.loadClients();
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el cliente'
          });
        }
      });
    } else {
      // Create
      const workshopId = this.authService.getWorkshopId();
      if (!workshopId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información del taller'
        });
        return;
      }

      const createRequest: CreateClientRequest = {
        name: this.currentClient.name!.trim(),
        last_name: this.currentClient.last_name!.trim(),
        email: this.currentClient.email!.trim(),
        cellphone_number: this.currentClient.cellphone_number!.trim(),
        mechanicals_id: workshopId,
        vehicle: [{
          plates: this.currentVehicle.plates!.trim(),
          model: this.currentVehicle.model!.trim(),
          make: this.currentVehicle.make!.trim()
        }]
      };

      this.clientService.createClient(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente'
          });
          this.clientDialogVisible = false;
          this.loadClients();
        },
        error: (error) => {
          console.error('Error creating client:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el cliente'
          });
        }
      });
    }
  }

  hideDialog() {
    this.clientDialogVisible = false;
    this.currentClient = {};
    this.currentVehicle = {};
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  }

  getFullName(client: Client): string {
    if (!client.person) return 'N/A';
    return `${client.person.name} ${client.person.last_name}`;
  }

  getVehicleInfo(client: Client): string {
    if (!client.vehicles || client.vehicles.length === 0) return 'Sin vehículo';
    const vehicle = client.vehicles[0];
    return `${vehicle.make} ${vehicle.model} (${vehicle.plates})`;
  }
}

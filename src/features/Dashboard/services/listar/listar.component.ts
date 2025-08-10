import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextarea } from 'primeng/inputtextarea';

import { MessageService, ConfirmationService } from 'primeng/api';

// Models y Services
import { Service, CreateService, UpdateService } from '../models/services.model';
import { ServicesService } from '../services/services.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputTextarea
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  services: Service[] = [];
  loading = false;
  mechanicalWorkshopId: number;

  // Modal variables
  showModal = false;
  isEditing = false;
  modalTitle = '';

  // Form data
  serviceForm: Partial<CreateService & UpdateService> = {
    name: '',
    description: '',
    price: 0
  };

  constructor(
    private servicesService: ServicesService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.mechanicalWorkshopId = this.authService.getMechanicalWorkshopData()?.id;
  }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    if (!this.mechanicalWorkshopId) {
      console.error('mechanical_workshop_id no está disponible');
      return;
    }

    this.loading = true;
    this.servicesService.load(this.mechanicalWorkshopId).subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
        console.log('Servicios cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los servicios'
        });
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.modalTitle = 'Crear Nuevo Servicio';
    this.serviceForm = {
      name: '',
      description: '',
      price: 0
    };
    this.showModal = true;
  }

  openEditModal(service: Service) {
    this.isEditing = true;
    this.modalTitle = 'Editar Servicio';
    this.serviceForm = {
      services_id: service.services_id,
      name: service.name,
      description: service.description || '',
      price: service.price || 0
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.serviceForm = {
      name: '',
      description: '',
      price: 0
    };
  }

  saveService() {
    if (!this.mechanicalWorkshopId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID del taller no disponible'
      });
      return;
    }

    if (!this.serviceForm.name) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, completa el nombre del servicio'
      });
      return;
    }

    if (this.isEditing && this.serviceForm.services_id) {
      // Actualizar servicio existente
      const updateData = {
        name: this.serviceForm.name,
        description: this.serviceForm.description,
        price: this.serviceForm.price
      };

      this.servicesService.update(this.serviceForm.services_id, updateData, this.mechanicalWorkshopId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Servicio actualizado correctamente'
          });
          this.loadServices();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar servicio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el servicio'
          });
        }
      });
    } else {
      // Crear nuevo servicio
      const createData = {
        name: this.serviceForm.name,
        description: this.serviceForm.description,
        price: this.serviceForm.price
      };

      this.servicesService.create(createData, this.mechanicalWorkshopId).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Servicio creado correctamente'
          });
          this.loadServices();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear servicio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el servicio'
          });
        }
      });
    }
  }

  deleteService(service: Service) {
    if (!this.mechanicalWorkshopId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID del taller no disponible'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el servicio "${service.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesService.delete(service.services_id, this.mechanicalWorkshopId!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Servicio eliminado correctamente'
            });
            this.loadServices();
          },
          error: (error) => {
            console.error('Error al eliminar servicio:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el servicio'
            });
          }
        });
      }
    });
  }
}

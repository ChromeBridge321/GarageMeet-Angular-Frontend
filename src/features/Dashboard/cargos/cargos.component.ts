import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { PositionService } from '../../../core/services/position.service';
import { AuthService } from '../../../core/services/auth.service';
import { Position, CreatePositionRequest, UpdatePositionRequest } from '../../../core/models/position.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cargos',
  imports: [
    CommonModule,
    FormsModule,
    DashboardLayoutComponent,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {

  // Signals para el estado
  positions = signal<Position[]>([]);
  loading = signal(false);

  // Dialog states
  positionDialogVisible = false;
  isEditing = signal(false);

  // Form data
  currentPosition: Partial<Position> = {};

  constructor(
    private positionService: PositionService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
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

    this.positionService.getAllPositions({
      mechanical_workshops_id: workshopId
    }).subscribe({
      next: (response) => {
        this.positions.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading positions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los cargos'
        });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.currentPosition = {};
    this.isEditing.set(false);
    this.positionDialogVisible = true;
  }

  editPosition(position: Position) {
    this.currentPosition = { ...position };
    this.isEditing.set(true);
    this.positionDialogVisible = true;
  }

  deletePosition(position: Position) {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el cargo "${position.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (position.positions_id) {
          this.positionService.deletePosition({
            positions_id: position.positions_id
          }).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cargo eliminado correctamente'
              });
              this.loadPositions();
            },
            error: (error) => {
              console.error('Error deleting position:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el cargo'
              });
            }
          });
        }
      }
    });
  }

  savePosition() {
    if (!this.currentPosition.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El nombre del cargo es requerido'
      });
      return;
    }

    if (this.isEditing()) {
      // Update
      const updateRequest: UpdatePositionRequest = {
        positions_id: this.currentPosition.positions_id!,
        name: this.currentPosition.name.trim()
      };

      this.positionService.updatePosition(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cargo actualizado correctamente'
          });
          this.positionDialogVisible = false;
          this.loadPositions();
        },
        error: (error) => {
          console.error('Error updating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el cargo'
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

      const createRequest: CreatePositionRequest = {
        name: this.currentPosition.name.trim(),
        mechanical_workshops_id: workshopId
      };

      this.positionService.createPosition(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cargo creado correctamente'
          });
          this.positionDialogVisible = false;
          this.loadPositions();
        },
        error: (error) => {
          console.error('Error creating position:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el cargo'
          });
        }
      });
    }
  }

  hideDialog() {
    this.positionDialogVisible = false;
    this.currentPosition = {};
  }
}

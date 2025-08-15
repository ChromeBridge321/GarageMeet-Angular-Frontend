import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CargosService } from '../services/cargos.service';
import { RESTPositions } from '../models/cargos.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../../../core/services/Subscription.service';
import { Button } from "primeng/button"; '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
// Forms
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from "primeng/confirmdialog";
import { Position } from '../../empleados/models/empleados.model';
@Component({
  selector: 'app-listar',
  imports: [TableModule, Button, Dialog, InputTextModule, ReactiveFormsModule, FormsModule, Toast, ConfirmDialog, TooltipModule],
  templateUrl: './listar.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ListarComponent implements OnInit {
  positions: RESTPositions[] = [];
  loading: boolean = true;
  mechanicalWorkshopId: number;
  visible: boolean = false;
  positionForm: FormGroup;
  title = {
    title: 'Crear Cargo',
    subTitle: 'Registrar un nuevo cargo'
  }
  isEdit: boolean = false;
  constructor(
    private readonly cargosService: CargosService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.mechanicalWorkshopId = this.authService.getMechanicalWorkshopData()?.id;
    this.positionForm = this.fb.group({
      name: ['', Validators.required],
      positions_id: '',
      mechanical_workshops_id: [this.mechanicalWorkshopId, Validators.required]
    });
  }


  ngOnInit() {
    this.listar();
  }

  // Getter para verificar suscripción desde el template
  get canModifyData(): boolean {
    return this.subscriptionService.canAccessDashboard();
  }

  isEditFunction() {
    return this.title = {
      title: 'Editar Cargo',
      subTitle: 'Editar un cargo existente'
    }
  }

  resetForm() {
    this.positionForm.reset();
    this.visible = false;
  }
  showDialog(action: boolean, positions_id: number = 0) {
    // Verificar suscripción solo para crear/editar (no para listar)
    if (!this.subscriptionService.canAccessDashboard()) {
      this.showErrorMessage('Necesitas una suscripción activa para crear o editar cargos');
      return;
    }

    this.visible = true;
    this.isEdit = action;
    if (this.isEdit) {
      this.showInfoMessage('Cargando datos del cargo...');
      this.isEditFunction();
      this.getPositionData(positions_id, this.mechanicalWorkshopId);
    } else {
      this.title = {
        title: 'Crear Cargo',
        subTitle: 'Registrar un nuevo cargo'
      }


    }
  }
  listar() {
    this.loading = true;
    this.cargosService.load(this.mechanicalWorkshopId).subscribe((data) => {
      this.positions = data;
      this.loading = false;
    });
  }

  createPosition() {
    console.log(this.positionForm.value);
    if (this.positionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.'
      });
      this.listar();
      return;
    }
    this.cargosService.create(this.positionForm.value).subscribe(
      {
        next: () => {
          this.showSuccessMessage('Cargo creado exitosamente');
          this.visible = false;
          this.listar();
          this.positionForm.patchValue({
            name: '',
          });
        },
        error: (error) => {
          error = error.error.error;

          if (error == 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
            this.showErrorMessage(error);
          } else {
            this.showErrorMessage('Error al crear el cargo');
          }
        }
      }
    );
  }

  deletePosition(position: Position) {

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este cargo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.cargosService.delete(position.positions_id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cargo eliminado correctamente'
            });
            this.listar();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cargo'
            });
          }
        });
      }
    });
  }

  getPositionData(positions_id: number, mechanical_workshops_id: number = this.mechanicalWorkshopId) {
    this.cargosService.getById(positions_id, mechanical_workshops_id).subscribe((data) => {
      this.showSuccessMessage('Datos cargados con éxito.');
      this.positionForm.setValue({
        name: data.name,
        mechanical_workshops_id: this.mechanicalWorkshopId,
        positions_id: data.positions_id
      });
    });
  }

  updatePosition() {
    console.log(this.positionForm.value);
    if (this.positionForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const positionData = this.positionForm.value;
    this.cargosService.update(positionData).subscribe({
      next: () => {
        this.showSuccessMessage('Cargo actualizado exitosamente.');

        setTimeout(() => {
          this.visible = false;
          this.listar();
          this.positionForm.patchValue({
            name: '',
          });
        }, 1000);
      },
      error: (error) => {
        error = error.error.error;

        if (error == 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
          this.showErrorMessage(error);
        } else {
          this.showErrorMessage('Error al actualizar el cargo');
        }
      }
    });
  }
  // Message helpers
  private showErrorMessage(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail
    });
  }

  private showSuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail
    });
  }

  private showInfoMessage(detail: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail
    });
  }

  limpiarFiltros(table: any) {
    table.clear();
    // Limpiar también los inputs de filtro por columna
    const filterInputs = document.querySelectorAll('input[pInputText]');
    filterInputs.forEach((input: any) => {
      input.value = '';
    });
  }

}

import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CargosService } from './cargos.service';
import { RESTPositions } from '../models/cargos.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Button } from "primeng/button"; '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
// Forms
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from "primeng/confirmdialog";
@Component({
  selector: 'app-listar',
  imports: [TableModule, Button, Dialog, InputTextModule, ReactiveFormsModule, FormsModule, Toast, ConfirmDialog],
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
          this.positionForm.reset();
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

  delete(positions_id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este cargo?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.cargosService.delete(positions_id).subscribe(() => {
          this.listar();
          this.showSuccessMessage('Cargo eliminado con éxito');
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
          this.positionForm.reset();
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

}

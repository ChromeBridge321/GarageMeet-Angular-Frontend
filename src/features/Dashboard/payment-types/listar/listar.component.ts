import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaymentTypesService } from '../services/payment-types.service';
import { PaymentType } from '../models/payment-types.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../../../core/services/Subscription.service';
import { Button } from "primeng/button";
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

@Component({
  selector: 'app-listar-payment-types',
  imports: [
    TableModule,
    Button,
    Dialog,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    Toast,
    ConfirmDialog,
    TooltipModule
  ],
  templateUrl: './listar.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ListarPaymentTypesComponent implements OnInit {
  paymentTypes: PaymentType[] = [];
  loading: boolean = true;
  mechanicalWorkshopId: number;
  visible: boolean = false;
  paymentTypeForm: FormGroup;
  title = {
    title: 'Crear Tipo de Pago',
    subTitle: 'Registrar un nuevo tipo de pago'
  }
  isEdit: boolean = false;

  constructor(
    private readonly paymentTypesService: PaymentTypesService,
    private readonly authService: AuthService,
    private readonly subscriptionService: SubscriptionService,
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.mechanicalWorkshopId = this.authService.getMechanicalWorkshopData()?.id;
    console.log('mechanicalWorkshopId:', this.mechanicalWorkshopId);
    console.log('getMechanicalWorkshopData:', this.authService.getMechanicalWorkshopData());

    this.paymentTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      payment_types_id: '',
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
      title: 'Editar Tipo de Pago',
      subTitle: 'Editar un tipo de pago existente'
    }
  }

  resetForm() {
    this.paymentTypeForm.reset();
    this.paymentTypeForm.patchValue({
      mechanical_workshops_id: this.mechanicalWorkshopId
    });
    this.visible = false;
  }

  showDialog(action: boolean, payment_types_id: number = 0) {
    console.log('showDialog called', { action, payment_types_id });
    console.log('canAccessDashboard:', this.subscriptionService.canAccessDashboard());

    // Verificar suscripción solo para crear/editar (no para listar)
    if (!this.subscriptionService.canAccessDashboard()) {
      this.showErrorMessage('Necesitas una suscripción activa para crear o editar tipos de pago');
      return;
    }

    console.log('Setting visible to true');

    this.isEdit = action;
    if (this.isEdit) {
      this.showInfoMessage('Cargando datos del tipo de pago...');
      this.isEditFunction();
      this.getPaymentTypeData(payment_types_id);
    } else {

      this.title = {
        title: 'Crear Tipo de Pago',
        subTitle: 'Registrar un nuevo tipo de pago'
      }
      this.resetForm();
    }
    this.visible = true;
    console.log('Dialog state:', { visible: this.visible, isEdit: this.isEdit });
  }

  listar() {
    this.loading = true;
    this.paymentTypesService.load(this.mechanicalWorkshopId).subscribe({
      next: (data) => {
        this.paymentTypes = data;
        this.loading = false;
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los tipos de pago');
        this.loading = false;
      }
    });
  }

  createPaymentType() {
    if (this.paymentTypeForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.'
      });
      return;
    }

    const formData = { ...this.paymentTypeForm.value };
    delete formData.payment_types_id; // Remove ID for creation

    this.paymentTypesService.create(formData).subscribe({
      next: () => {
        this.showSuccessMessage('Tipo de pago creado exitosamente');
        this.visible = false;
        this.listar();
        this.paymentTypeForm.reset();
        this.paymentTypeForm.patchValue({
          mechanical_workshops_id: this.mechanicalWorkshopId
        });
      },
      error: (error) => {
        const errorMessage = error.error?.error;
        if (errorMessage === 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
          this.showErrorMessage(errorMessage);
        } else {
          this.showErrorMessage('Error al crear el tipo de pago');
        }
      }
    });
  }

  delete(payment_types_id: number) {
    // Verificar suscripción antes de eliminar
    if (!this.subscriptionService.canAccessDashboard()) {
      this.showErrorMessage('Necesitas una suscripción activa para eliminar tipos de pago');
      return;
    }

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este tipo de pago?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.paymentTypesService.delete(payment_types_id).subscribe({
          next: () => {
            this.listar();
            this.showSuccessMessage('Tipo de pago eliminado con éxito');
          },
          error: (error) => {
            this.showErrorMessage('Error al eliminar el tipo de pago');
          }
        });
      }
    });
  }

  getPaymentTypeData(payment_types_id: number) {
    this.paymentTypesService.getById(payment_types_id, this.mechanicalWorkshopId).subscribe({
      next: (data) => {
        this.showSuccessMessage('Datos cargados con éxito.');
        this.paymentTypeForm.setValue({
          name: data.name,
          description: data.description || '',
          mechanical_workshops_id: this.mechanicalWorkshopId,
          payment_types_id: data.payment_types_id
        });
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los datos del tipo de pago');
      }
    });
  }

  updatePaymentType() {
    if (this.paymentTypeForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const paymentTypeData = {
      payment_types_id: this.paymentTypeForm.value.payment_types_id,
      name: this.paymentTypeForm.value.name,
      description: this.paymentTypeForm.value.description,
      mechanical_workshops_id: this.mechanicalWorkshopId
    };

    this.paymentTypesService.update(paymentTypeData).subscribe({
      next: () => {
        this.showSuccessMessage('Tipo de pago actualizado exitosamente.');
        setTimeout(() => {
          this.visible = false;
          this.listar();
          this.paymentTypeForm.reset();
          this.paymentTypeForm.patchValue({
            mechanical_workshops_id: this.mechanicalWorkshopId
          });
        }, 1000);
      },
      error: (error) => {
        const errorMessage = error.error?.error;
        if (errorMessage === 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
          this.showErrorMessage(errorMessage);
        } else {
          this.showErrorMessage('Error al actualizar el tipo de pago');
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

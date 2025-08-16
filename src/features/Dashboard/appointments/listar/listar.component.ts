import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { AppointmentsService } from '../services/appointments.service';
import { RESTCita } from '../models/citas.model';

@Component({
  selector: 'app-listar-appointments',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ListarAppointmentsComponent implements OnInit {
  citasServices = inject(AppointmentsService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  citas: RESTCita[] = [];
  showDetailsDialog = false;
  citaDetails: RESTCita | null = null;

  // Propiedades para el diálogo de confirmación
  showConfirmDialog = false;
  citaToConfirm: RESTCita | null = null;
  confirmationDate: Date | null = null;
  confirmationTime: Date | null = null;
  confirmationNotes: string = '';
  minDate: Date = new Date(); // No permitir fechas pasadas

  // Opciones para el filtro de estado
  statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Confirmada', value: 'confirmed' },
    { label: 'Cancelada', value: 'cancelled' },
    { label: 'Completada', value: 'completed' }
  ];

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citasServices.getAllAppointments().subscribe(citas => {
      this.citas = citas;
      console.log(this.citas);
    });
  }

  limpiarFiltros(table: any) {
    table.clear();
  }

  confirmarCita(cita: RESTCita) {
    this.citaToConfirm = cita;
    // Inicializar con valores por defecto
    this.confirmationDate = new Date();
    this.confirmationTime = new Date();
    this.confirmationNotes = '';
    this.showConfirmDialog = true;
  }

  closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.citaToConfirm = null;
    this.confirmationDate = null;
    this.confirmationTime = null;
    this.confirmationNotes = '';
  }

  executeConfirmation() {
    if (!this.citaToConfirm || !this.confirmationDate || !this.confirmationTime) {
      this.showErrorMessage('Por favor complete todos los campos requeridos');
      return;
    }

    const fechaConfirmada = this.confirmationDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Formatear la hora correctamente para el backend (H:i:s)
    const hours = this.confirmationTime.getHours().toString().padStart(2, '0');
    const minutes = this.confirmationTime.getMinutes().toString().padStart(2, '0');
    const horaConfirmada = `${hours}:${minutes}:00`; // H:i:s format

    console.log('Enviando confirmación:', {
      appointment_id: this.citaToConfirm.appointment_id,
      confirmed_date: fechaConfirmada,
      confirmed_time: horaConfirmada,
      notes: this.confirmationNotes || 'Cita confirmada desde el dashboard'
    });

    this.citasServices.confirmAppointment(
      this.citaToConfirm.appointment_id,
      fechaConfirmada,
      horaConfirmada,
      this.confirmationNotes || 'Cita confirmada desde el dashboard'
    ).subscribe({
      next: () => {
        this.showSuccessMessage(`La cita de ${this.citaToConfirm!.client_name} ha sido confirmada exitosamente.`);
        this.closeConfirmDialog();
        this.cargarCitas();
      },
      error: (err) => {
        console.error('Error al confirmar cita:', err);
        this.showErrorMessage(`Error al confirmar la cita: ${err.error?.message || err.message || 'Error desconocido'}`);
      }
    });
  }

  private procesarConfirmacion(cita: RESTCita) {
    // Para simplicidad, usamos la fecha actual como fecha confirmada
    const fechaActual = new Date();
    const fechaConfirmada = fechaActual.toISOString().split('T')[0]; // YYYY-MM-DD

    // Formatear la hora correctamente (H:i:s)
    const hours = fechaActual.getHours().toString().padStart(2, '0');
    const minutes = fechaActual.getMinutes().toString().padStart(2, '0');
    const horaConfirmada = `${hours}:${minutes}:00`;

    this.citasServices.confirmAppointment(cita.appointment_id, fechaConfirmada, horaConfirmada, 'Cita confirmada').subscribe({
      next: () => {
        this.showSuccessMessage(`La cita de ${cita.client_name} ha sido confirmada exitosamente.`);
        this.cargarCitas();
      },
      error: (err) => {
        console.error('Error al confirmar cita:', err);
        this.showErrorMessage(`Error al confirmar la cita: ${err.error?.message || err.message || 'Error desconocido'}`);
      }
    });
  }

  cancelarCita(cita: RESTCita) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea cancelar la cita de ${cita.client_name}?`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No, mantener',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.procesarCancelacion(cita);
      },
      reject: () => {
        this.showInfoMessage('Cancelación abortada');
      }
    });
  }

  private procesarCancelacion(cita: RESTCita) {
    this.citasServices.cancelAppointment(cita.appointment_id).subscribe({
      next: () => {
        this.showSuccessMessage(`La cita de ${cita.client_name} ha sido cancelada exitosamente.`);
        this.cargarCitas();
      },
      error: (err) => {
        this.showErrorMessage(`Error al cancelar la cita: ${err.message || 'Error desconocido'}`);
      }
    });
  }

  showCitaDetails(cita: RESTCita) {
    this.citaDetails = cita;
    this.showDetailsDialog = true;
  }

  confirmarCitaFromDetails() {
    if (this.citaDetails) {
      this.showDetailsDialog = false;
      this.confirmarCita(this.citaDetails);
    }
  }

  cancelarCitaFromDetails() {
    if (this.citaDetails) {
      this.showDetailsDialog = false;
      this.cancelarCita(this.citaDetails);
    }
  }

  marcarComoCompletadaFromDetails() {
    if (this.citaDetails) {
      this.showDetailsDialog = false;
      this.marcarComoCompletada(this.citaDetails);
    }
  }

  marcarComoCompletada(cita: RESTCita) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea marcar como completada la cita de ${cita.client_name}?`,
      header: 'Confirmar Completación',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sí, completar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.procesarCompletacion(cita);
      },
      reject: () => {
        this.showInfoMessage('Operación cancelada');
      }
    });
  }

  private procesarCompletacion(cita: RESTCita) {
    this.citasServices.markAsCompleted(cita.appointment_id).subscribe({
      next: () => {
        this.showSuccessMessage(`La cita de ${cita.client_name} ha sido marcada como completada exitosamente.`);
        this.cargarCitas();
      },
      error: (err) => {
        console.error('Error al marcar como completada:', err);
        this.showErrorMessage(`Error al completar la cita: ${err.error?.message || err.message || 'Error desconocido'}`);
      }
    });
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): string {
    const severityMap: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'success',
      'cancelled': 'danger',
      'completed': 'info'
    };
    return severityMap[status] || 'info';
  }

  getStatusClasses(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'confirmed': 'bg-green-100 text-green-800 border border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border border-red-200',
      'completed': 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

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

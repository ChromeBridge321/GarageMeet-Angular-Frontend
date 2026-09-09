import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LocationsService } from './services/locations.service';
import { LocationOption } from './models/location.model';
import { MechanicalService } from './services/Mechanical.service';
import { MechanicalREST } from './models/mechanicalW.model';
import { AppointmentsService } from '../Dashboard/appointments/services/appointments.service';
import { AuthService } from '../../core/services/auth.service';
import { CreaCita } from '../Dashboard/appointments/models/citas.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  imports: [CommonModule, NavComponent, ButtonModule, ReactiveFormsModule, AutoCompleteModule, FormsModule, ToastModule, DialogModule, InputTextModule, InputTextarea, ProgressSpinnerModule, Button],
  templateUrl: './search.component.html',
  styleUrl: 'search.component.css',
  providers: [MessageService]
})
export class SearchComponent {
  locationsService = inject(LocationsService);
  mechanicalService = inject(MechanicalService);
  appointmentsService = inject(AppointmentsService);
  authService = inject(AuthService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);

  items: LocationOption[] = [];
  selectedLocation: LocationOption | null = null;
  mechanicals: MechanicalREST[] = [];
  ClientData = this.authService.getAuthData();

  // Propiedades del diálogo
  displayDialog = false;
  selectedMechanicId: number = 0;
  appointmentForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.appointmentForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.minLength(2)]],
      client_email: ['', [Validators.required, Validators.email]],
      client_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  search(event: AutoCompleteCompleteEvent) {
    if (event.query.trim().length < 2) {
      this.items = [];
      return;
    }

    this.locationsService.search(event.query).subscribe(locations => {
      this.items = locations;
    });
  }

  onSearch(value: LocationOption | null = this.selectedLocation) {
    if (!value?.id || !value.type) {
      this.showErrorMessage('Selecciona un estado o municipio válido');
      return;
    }

    this.mechanicalService.getMechanicalWorkshopsByLocation(value.type, value.id).subscribe(mechanicals => {
      console.log(mechanicals);
      this.mechanicals = mechanicals;
    });
  }

  agendarCita(mechanic_id: number) {
    this.selectedMechanicId = mechanic_id;
    this.displayDialog = true;

    // Pre-llenar el formulario con los datos del usuario si están disponibles
    if (this.ClientData) {
      this.appointmentForm.patchValue({
        client_name: this.ClientData.user.name || '',
        client_email: this.ClientData.user.email || ''
      });
    }
  }

  submitAppointment() {
    if (this.appointmentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.appointmentForm.value;

      const appointmentData: CreaCita = {
        mechanical_workshops_id: this.selectedMechanicId,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_email: formData.client_email,
        description: formData.description,
        created_by: 'app'
      };

      this.appointmentsService.requestAppointment(appointmentData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccessMessage('Cita agendada exitosamente. Pronto recibirás un correo de confirmación.');
          this.closeDialog();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error al agendar la cita:', error);
          this.showErrorMessage('Error al agendar la cita');
        }
      });
    } else if (this.isSubmitting) {
      this.showErrorMessage('Por favor, espera mientras se procesa tu solicitud');
    } else {
      this.showErrorMessage('Por favor, completa todos los campos correctamente');
    }
  }

  closeDialog() {
    this.displayDialog = false;
    this.appointmentForm.reset();
    this.selectedMechanicId = 0;
    this.isSubmitting = false;
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
}

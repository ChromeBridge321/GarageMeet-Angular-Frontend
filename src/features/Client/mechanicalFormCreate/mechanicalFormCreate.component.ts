import { Component, signal, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitiesREST } from '../../search/models/cities.model';
import { AutoComplete } from "primeng/autocomplete";
import { CitiesService } from '../../search/services/cities.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CreateMechanicalWorkshopService } from './services/createMechanicalWorkshop.service';
import { UserService } from './services/user.service';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-mechanical-form-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AutoComplete, FormsModule, InputTextModule, InputMask, Toast],
  templateUrl: './mechanicalFormCreate.component.html',
  providers: [MessageService]
})
export class MechanicalFormCreateComponent implements OnInit {
  mechanicalForm!: FormGroup;
  isLoading = signal(false);
  states = signal<any[]>([]);
  items: any[] = [];
  value: any;
  city: CitiesREST | undefined;
  authservice = inject(AuthService);
  citiesService = inject(CitiesService);
  messageService = inject(MessageService);
  userService = inject(UserService);
  mechanicalService = inject(CreateMechanicalWorkshopService);
  users_id = this.authservice.getUserId();
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.mechanicalForm = this.fb.group({
      users_id: [this.users_id],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      states_id: [''],
      cities_id: [''],
      address: ['', [Validators.required, Validators.minLength(10)]],
      google_maps_link: ['']
    });

  }

  search(event: AutoCompleteCompleteEvent) {
    this.citiesService.searchCitiesByName(event.query).subscribe(cities => {
      this.items = cities; //cities.map((item ) => item.city_name + ', ' + item.state_name);
    });
  }


  createMechanical(autocompleteValue: CitiesREST) {
    if (!this.mechanicalForm.valid) {
      this.showErrorMessage('Por favor, corrige los errores en el formulario');
      return;
    }
    if (autocompleteValue === undefined) {
      this.showErrorMessage('Por favor, selecciona la ubicación del taller');
      return;
    }
    this.mechanicalForm.patchValue({
      states_id: autocompleteValue.states_id,
      cities_id: autocompleteValue.cities_id,
      google_maps_link: this.mechanicalForm.value.google_maps_link === '' ? 'sin enlace' : this.mechanicalForm.value.google_maps_link
    });
    const formData = this.mechanicalForm.value;
    this.mechanicalService.create(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showSuccessMessage('Taller creado exitosamente');
        this.showInfoMessage('Felicidades ya eres parte de nuestro equipo, que disfrutes tu experiencia con nosotros!!! 🎉🎉🎉');
        this.mechanicalForm.reset();
        this.userService.updateUserRol(1).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading.set(false);
              // Redireccionar o mostrar mensaje de éxito
              this.authservice.logout();
              this.router.navigate(['/login']);
            }, 3000);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showErrorMessage('Error al crear taller');
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

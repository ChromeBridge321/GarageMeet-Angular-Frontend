import { Component, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
// Forms
import { ReactiveFormsModule, FormGroup, FormsModule, FormBuilder, Validators } from '@angular/forms';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ClientesService } from '../listar/clientes.service';
import { VehicleSearchService } from '../crear/VehicleSearch.service';
import { ClientFormService } from '../crear/clienteForm.service';
import { AuthService } from '../../../../core/services/auth.service';
import { VehiculosService } from '../vehiculos/vehiculos.service';
import { Make, Model } from '../vehiculos/models/vehiculo.model';
@Component({
  selector: 'app-editar',
  imports: [
    InputTextModule,
    FormsModule,
    SelectModule,
    FloatLabel,
    ReactiveFormsModule,
    NgIf,
    Toast,
    Ripple,
    ButtonModule,
    RouterLink,
    InputMask
  ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css',
  providers: [MessageService],

})
export class EditarComponent implements OnInit {
  clientForm: FormGroup;
  client_id: number;
  mechanical_workshops_id: number;
  models = signal<Model[]>([]);
  makes = signal<Make[]>([]);
  constructor(
    private readonly messageService: MessageService,
    private readonly clientesService: ClientesService,
    private readonly formService: ClientFormService,
    public readonly searchService: VehicleSearchService,
    public readonly AuthService: AuthService,
    public readonly Router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly vehiculosService: VehiculosService
  ) {
    this.clientForm = this.fb.group({
      peoples_id: ['', Validators.required],
      name: ['', Validators.required],
      clients_id: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      vehicle: this.fb.array([this.fb.group({
        vehicles_id: ['', Validators.required],
        make_id: ['', Validators.required],
        model_id: ['', Validators.required],
        plates: ['', [Validators.required, Validators.maxLength(15)]],
      })])
    });


    this.client_id = Number(this.route.snapshot.paramMap.get('id')); // Initialize with a default value
    this.mechanical_workshops_id = this.AuthService.mechanicalWorkshop()?.id;
  }


  ngOnInit(): void {
    this.searchService.initializeData();
    // Usar setTimeout para asegurar que el Toast esté inicializado
    setTimeout(() => {
      this.showInfoMessage('Cargando datos del cliente...');
    }, 100);
    this.loadClientData()
  }

  loadClientData(): void {
    this.clientesService.getById(this.client_id, this.mechanical_workshops_id).subscribe({
      next: (data) => {
        this.loadModels();
        this.clientForm.setValue({
          name: data.person.name,
          clients_id: data.clients_id,
          peoples_id: data.person.peoples_id,
          last_name: data.person.last_name,
          email: data.person.email,
          cellphone_number: data.person.cellphone_number,
          vehicle: data.vehicles.map(vehicle => ({
            vehicles_id: vehicle.vehicles_id,
            make_id: '',
            model_id: '',
            plates: vehicle.plates.toUpperCase()
          }))
        });
        this.showSuccessMessage('Datos cargados con éxito.');
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los datos del cliente.');
      }
    });
  }


  ngOnDestroy(): void {
    this.searchService.destroy();
  }

  updateClient(): void {
    console.log(this.clientForm.value);
    //return;
    if (this.clientForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const clientData = this.clientForm.value;
    this.clientesService.update(clientData).subscribe({
      next: () => {
        this.showSuccessMessage('Cliente actualizado exitosamente.');
        this.resetForm();
        setTimeout(() => {
          this.Router.navigate(['/panel/clientes']);
        }, 1000);
      },
      error: (error) => {
        this.showErrorMessage('Verifique los datos del vehículo seleccionado');
      }
    });
  }
  getMakesByName(searchTerm: string): void {
    if (searchTerm == null || searchTerm.trim() === '') {
      this.loadMakes();
      return;
    }
    this.vehiculosService.getMakesByName(searchTerm).subscribe(data => {
      this.makes.set(data);
    });
  }

  getModelsByName(searchTerm: string): void {
    if (searchTerm == null || searchTerm.trim() === '') {
      this.loadModels();
      return;
    }
    this.vehiculosService.getModelsByName(searchTerm).subscribe(data => {
      this.models.set(data);
    });
  }

  loadModels(): void {
    this.vehiculosService.getModels().subscribe((data) => {
      this.models.set(data);
    });
  }

  loadMakes(): void {
    this.vehiculosService.getMakes().subscribe((data) => {
      this.makes.set(data);
    });
  }

  private resetForm(): void {
    this.formService.resetForm(this.clientForm);
    this.searchService.resetToAllData();
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

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }
}

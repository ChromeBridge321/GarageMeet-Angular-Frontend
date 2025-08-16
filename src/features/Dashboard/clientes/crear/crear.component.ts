// Angular Core
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

// Forms
import { ReactiveFormsModule, FormGroup, FormsModule, FormArray } from '@angular/forms';
// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ClientesService } from '../services/clientes.service';
import { ClientFormService } from '../services/clienteForm.service';
import { VehicleSearchService } from '../services/VehicleSearch.service';
import { Make, Model } from '../vehiculos/models/vehiculo.model';
import { VehiculosService } from '../services/vehiculos.service';
@Component({
  selector: 'app-crear',
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
  templateUrl: './crear.component.html',
  providers: [MessageService],
})
export class CrearComponent implements OnInit, OnDestroy {
  clientFrom: FormGroup;
  models = signal<Model[]>([]);
  makes = signal<Make[]>([]);
  constructor(
    private readonly messageService: MessageService,
    private readonly clientesService: ClientesService,
    private readonly formService: ClientFormService,
    private readonly searchService: VehicleSearchService,
    private readonly vehiculosService: VehiculosService
  ) {
    this.clientFrom = this.formService.createClientForm();
  }



  ngOnInit(): void {
    this.searchService.initializeData();
  }

  ngOnDestroy(): void {
    this.searchService.destroy();
  }

  get vehicleFormArray(): FormArray {
    return this.clientFrom.get('vehicle') as FormArray;
  }

  get firstVehicle(): FormGroup {
    return this.vehicleFormArray.at(0) as FormGroup;
  }

  createClient(): void {
    if (this.clientFrom.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const client = this.clientFrom.value;
    this.clientesService.create(client).subscribe({
      next: () => {
        this.showSuccessMessage('Cliente creado exitosamente.');
        this.resetForm();
      },
      error: (error) => {
        error = error.error.error;

        if (error == 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
          this.showErrorMessage(error);
        } else {
          this.showErrorMessage('Error al crear el cliente');
        }
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
    this.formService.resetForm(this.clientFrom);
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
}

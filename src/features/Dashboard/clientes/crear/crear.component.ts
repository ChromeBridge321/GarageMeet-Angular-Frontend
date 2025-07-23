// Angular Core
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ClientesService } from '../listar/clientes.service';
import { ClientFormService } from './clienteForm.service';
import { VehicleSearchService } from './VehicleSearch.service';


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

  constructor(
    private readonly messageService: MessageService,
    private readonly clientesService: ClientesService,
    private readonly formService: ClientFormService,
    public readonly searchService: VehicleSearchService
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
        this.showErrorMessage('Verifique los datos del vehículo seleccionado');
      }
    });
  }


  getMakesByName(searchTerm: string): void {
    this.searchService.searchMakes(searchTerm);
  }

  getModelsByName(searchTerm: string): void {
    this.searchService.searchModels(searchTerm);
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
// Forms
import { ReactiveFormsModule, FormGroup, FormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';

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
import { ChangeDetectorRef } from '@angular/core';
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
  constructor(
    private readonly messageService: MessageService,
    private readonly clientesService: ClientesService,
    private readonly formService: ClientFormService,
    public readonly searchService: VehicleSearchService,
    public readonly AuthService: AuthService,
    public readonly Router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      mechanicals_id: [this.AuthService.mechanicalWorkshop()?.id, [Validators.required]],
      vehicle: this.fb.array([this.fb.group({
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
    this.loadClientData()
  }

  loadClientData(): void {
    this.clientesService.getById(this.client_id, this.mechanical_workshops_id).subscribe(data => {
      console.log('Data received:', data); // Para debug

      // Clear the existing vehicle array first
      this.vehicleFormArray.clear();

      // Push a new FormGroup instead of using setValue
      this.vehicleFormArray.push(this.fb.group({
        make_id: [data.vehicles[0]?.make || '', Validators.required],
        model_id: [data.vehicles[0]?.model || '', Validators.required],
        plates: [data.vehicles[0]?.plates || '', [Validators.required, Validators.maxLength(15)]],
      }));

      // Set the rest of the form values
      this.clientForm.patchValue({
        name: data.person.name,
        last_name: data.person.last_name,
        cellphone_number: data.person.cellphone_number,
        email: data.person.email,
        mechanicals_id: data.mechanical_workshops_id,
      });

      console.log('Form after patch:', this.clientForm.value);

      // Force change detection if needed
      this.clientForm.updateValueAndValidity();
    });
  }
  ngOnDestroy(): void {
    this.searchService.destroy();
  }

  get vehicleFormArray(): FormArray {
    return this.clientForm.get('vehicle') as FormArray;
  }

  get firstVehicle(): FormGroup {
    return this.vehicleFormArray.at(0) as FormGroup;
  }

  updateClient(): void {
    if (this.clientForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const client = this.clientForm.value;
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
}

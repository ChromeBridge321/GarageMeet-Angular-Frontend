// Angular Core
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Forms
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';

// RxJS
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

// Models
import { Model, Make } from '../vehiculos/models/vehiculo.model';

// Services
import { VehiculosService } from '../vehiculos/vehiculos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ClientesService } from '../listar/clientes.service';


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
  // Constants
  private readonly SEARCH_DEBOUNCE_TIME = 300;
  private readonly DEFAULT_VEHICLE_DATA = {
    plates: 'ACSP-TOTO',
    makes_model_id: 525,
  };

  // Signals for reactive data
  models = signal<Model[]>([]);
  makes = signal<Make[]>([]);

  // Data storage for filtering
  allModels: Model[] = [];
  allMakes: Make[] = [];

  // Form
  clientFrom: FormGroup;

  // Services
  vehiclesService = inject(VehiculosService);

  // Search subjects
  private readonly searchSubject = new Subject<string>();
  private readonly searchModelsSubject = new Subject<string>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly clientesService: ClientesService
  ) {
    this.clientFrom = this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupSearchStreams();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.searchModelsSubject.complete();
  }

  // Form initialization
  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      mechanicals_id: [this.authService.mechanicalWorkshop()?.id, [Validators.required]],
      vehicle: [[this.DEFAULT_VEHICLE_DATA], Validators.required],
    });
  }

  // Data initialization
  private initializeData(): void {
    this.loadModels();
    this.loadMakes();
  }

  // Search setup
  private setupSearchStreams(): void {
    this.setupMakesSearch();
    this.setupModelsSearch();
  }

  // Client creation
  createClient(): void {
    if (this.clientFrom.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    const client = this.clientFrom.value;
    this.clientesService.crear(client).subscribe(() => {
      this.router.navigate(['/panel/clientes/crear']);
      this.showSuccessMessage('Cliente creado exitosamente.');
    });
  }

  // Data loading methods
  private loadModels(): void {
    this.vehiclesService.getModels().subscribe((data) => {
      this.allModels = data;
      this.models.set(data);
    });
  }

  private loadMakes(): void {
    this.vehiclesService.getMakes().subscribe((data) => {
      this.allMakes = data;
      this.makes.set(data);
    });
  }

  // Search stream setup
  private setupMakesSearch(): void {
    this.searchSubject.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        this.makes.set(this.allMakes);
      } else {
        this.searchMakesByName(searchTerm);
      }
    });
  }

  private setupModelsSearch(): void {
    this.searchModelsSubject.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.trim() === '') {
        this.models.set(this.allModels);
      } else {
        this.searchModelsByName(searchTerm);
      }
    });
  }

  // Public search handlers (called from template)
  getMakesByName(searchTerm: string): void {
    console.log('Filter term (makes):', searchTerm);
    this.searchSubject.next(searchTerm || '');
  }

  getModelsByName(searchTerm: string): void {
    console.log('Filter term (models):', searchTerm);
    this.searchModelsSubject.next(searchTerm || '');
  }

  // Private search methods
  private searchMakesByName(name: string): void {
    this.vehiclesService.getMakesByName(name).subscribe((data) => {
      this.makes.set(data);
      console.log('MakesFilter:', this.makes());
    });
  }

  private searchModelsByName(name: string): void {
    this.vehiclesService.getModelsByName(name).subscribe((data) => {
      this.models.set(data);
      console.log('ModelsFilter:', this.models());
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
}

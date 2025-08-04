import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Forms
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

//models
import { RESTEmployee } from '../models/empleados.model';
import { RESTPositions } from '../../cargos/models/cargos.model';
//services
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CargosService } from '../../cargos/services/cargos.service';
@Component({
  selector: 'app-crear',
  imports: [ReactiveFormsModule, InputTextModule, FloatLabel, SelectModule, InputMask, Toast, Ripple, ButtonModule, NgIf, RouterLink, FormsModule],
  templateUrl: './crear.component.html',
  providers: [MessageService],
})
export class CrearComponent implements OnInit {

  employeeForm: FormGroup;
  positions: RESTPositions[] = [];
  position_id = signal<number>(0);
  mechanicalWorkshopId: number;
  visible1: boolean = false;
  visible2: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cargosService: CargosService,

  ) {
    this.employeeForm = this.initializeForm();
    this.mechanicalWorkshopId = this.authService.mechanicalWorkshop()?.id;
  }

  // Form initialization
  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      mechanicals_id: [this.authService.mechanicalWorkshop()?.id, [Validators.required]],
      positions_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPositions();
  }

  // Create employee method
  createEmployee(): void {
    if (this.employeeForm.invalid) {
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }
    const employeeData = this.employeeForm.value;
    this.employeeService.create(employeeData).subscribe({
      next: () => {
        this.showSuccessMessage('Empleado creado exitosamente.');
         this.resetForm();
      },
      error: (error) => {
        console.log(error);
        error = error.error.error;

      if (error == 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
        this.showErrorMessage(error);
      } else {
        this.showErrorMessage('Error al crear el empleado');
      }
    }});
  }

  // Load positions from service
  loadPositions(): void {
    this.cargosService.load(this.mechanicalWorkshopId).subscribe((data) => {
      this.positions = data;
      if (this.positions.length > 0) {
        this.visible1 = true;
        this.visible2 = false;
      } else {
        this.visible1 = false;
        this.visible2 = true;
      }
    });
  }

  private resetForm(): void {
    this.employeeForm.reset();
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

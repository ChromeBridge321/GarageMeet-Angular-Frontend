import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// Forms
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { InputMask } from 'primeng/inputmask';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth.service';
import { Position } from '../models/empleados.model';
import { RESTPositions } from '../../cargos/models/cargos.model';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { CargosService } from '../../cargos/services/cargos.service';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-editar',
  imports: [
    InputTextModule,
    FloatLabel,
    SelectModule,
    InputMask,
    Toast,
    Ripple,
    ButtonModule,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],

  providers: [
    MessageService
  ],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent implements OnInit {
  employeeForm: FormGroup;
  positions: RESTPositions[] = [];
  mechanicals_id: number;
  employee_id: number;
  visible1: boolean = false;
  visible2: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private cargosService: CargosService,
    private Router: Router
  ) {
    this.employee_id = Number(this.route.snapshot.paramMap.get('id'));
    this.mechanicals_id = this.authService.mechanicalWorkshop()?.id || 0;
    // Initialize the form here or inject a service to fetch existing employee data
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      positions_id: [''],
      new_positions_id: ['', [Validators.required]],
      peoples_id: ['', [Validators.required]],
      employees_id: ['', [Validators.required]],
      positions_name: ['']
    });
  }
  ngOnInit(): void {

    setTimeout(() => {
      this.showInfoMessage('Cargando datos del empleado...');
    }, 100);
    this.loadEmployeeData();
    this.loadPositions();
  }

  updateEmployee() {

    console.log(this.employeeForm.value);
    if (this.employeeForm.invalid) {
      console.error('Formulario inválido:', this.employeeForm);
      this.showErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }
    this.employeeService.update(this.employeeForm.value).subscribe(
      {
        next: () => {
          this.showSuccessMessage('Empleado actualizado exitosamente.');
          setTimeout(() => {
            this.Router.navigate(['/panel/empleados']);
          }, 1000);

        },
        error: (error) => {
          error = error.error.error;

          if (error == 'Necesitas una suscripción activa para acceder a esta funcionalidad') {
            this.showErrorMessage(error);
          } else {
            this.showErrorMessage('Error al actualizar el empleado');
          }
        }
      }
    );
  }


  loadEmployeeData() {
    this.employeeService.getEmployeeById(this.employee_id, this.mechanicals_id).subscribe({
      next: (employee) => {

        this.employeeForm.setValue({
          name: employee.person.name,
          last_name: employee.person.last_name,
          cellphone_number: employee.person.cellphone_number,
          email: employee.person.email,
          positions_name: employee?.positions[0]?.name || 'Sin cargo actualmente',
          positions_id: employee?.positions[0]?.positions_id || null,
          peoples_id: employee.person.peoples_id,
          new_positions_id: '',
          employees_id: employee.employees_id,
        });

        this.showSuccessMessage('Datos del empleado cargados exitosamente.');
      },
      error: () => {
        this.showErrorMessage('Error al cargar los datos del empleado.');
      }
    });
  }

  loadPositions(): void {
    this.cargosService.load(this.mechanicals_id).subscribe({
      next: (data) => {
        this.positions = data;
        if (this.positions.length > 0) {
          this.visible1 = true;
          this.visible2 = false;
        } else {
          this.visible1 = false;
          this.visible2 = true;
        }
      },
      error: () => {
        this.showErrorMessage('Error al cargar la lista de cargos.');
      }
    });
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

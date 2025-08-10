import { Component, ViewChild } from '@angular/core';
import { Toast } from "primeng/toast";
import { Button } from "primeng/button";
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sale } from '../models/sales.model';
import { SalesService } from '../services/sales.service';
import { Select } from "primeng/select";
import { DatePicker } from 'primeng/datepicker';
import { PiecesService } from '../../pieces/services/pieces.service';
import { Piece } from '../../pieces/models/pieces.model';
import { ServicesService } from '../../services/services/services.service';
import { Service } from '../../services/models/services.model';
import { EmployeeService } from '../../empleados/services/employee.service';
import { PaymentTypesService } from '../../payment-types/services/payment-types.service';
import { PaymentType } from '../models/sales.model';
import { OnInit } from '@angular/core';
import { RESTEmployee } from '../../empleados/models/empleados.model';
import { RESTClient } from '../../clientes/models/clientes.model';
import { ClientesService } from '../../clientes/services/clientes.service';
import { Calendar } from 'primeng/calendar';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-crear',
  imports: [Toast, Button, RouterLink, InputText, AutoCompleteModule, ReactiveFormsModule, FormsModule, CommonModule, Select, DatePicker],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css',
  providers: [MessageService]
})
export class CrearComponent implements OnInit {
  @ViewChild('datepicker') datepicker!: Calendar;
  mechanicalWorkshopId: number;
  saleeForm: FormGroup;
  paymentTypes: PaymentType[] | undefined;
  employees: RESTEmployee[] | undefined;
  vehicles: RESTClient[] | undefined;
  items: any[] = [];
  pieces: Piece[] = [];
  services: Service[] = [];
  sale: Sale[] | undefined;
  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly salesService: SalesService,
    private readonly piecesService: PiecesService,
    private readonly servicesService: ServicesService,
    private readonly employeeService: EmployeeService,
    private readonly paymentTypesService: PaymentTypesService,
    private readonly vehiclesService: ClientesService
  ) {
    this.saleeForm = this.initializeForm();
    this.mechanicalWorkshopId = this.authService.mechanicalWorkshop()?.id;
  }
  // Form initialization
  private initializeForm(): FormGroup {
    return this.fb.group({
      payment_types_id: ['', Validators.required],
      employees_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      vehicles_id: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      mechanical_workshops_id: [this.mechanicalWorkshopId],
      date: ['', [Validators.required]],
      price: ['', [Validators.required]],
      services: [[''], [Validators.required]],
      pieces: [[''], [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadPaymentTypes();
    this.loadEmployees();
    this.loadVehicles();
  }

  getDateValue(): void {
    const selectedDate = this.datepicker.value; // Obtiene el valor seleccionado
    console.log('Fecha seleccionada:', selectedDate);
  }
  createEmployee(services: Service[], pieces: Piece[], date: string) {
    const piecesIds: number[] = this.storePiecesIds(pieces);
    const servicesIds: number[] = this.storeServicesIds(services);

    this.saleeForm.patchValue({
      pieces: piecesIds,
      services: servicesIds,
      mechanical_workshops_id: this.mechanicalWorkshopId,
      date: date
    });

    console.log(this.saleeForm.value);
  }

  searchPieces(event: AutoCompleteCompleteEvent) {
    this.piecesService.getByName(event.query, this.mechanicalWorkshopId).subscribe({
      next: (pieces) => {
        this.pieces = pieces;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las piezas.' });
      }
    });
  }

  searchServices(event: AutoCompleteCompleteEvent) {
    this.servicesService.getByName(event.query, this.mechanicalWorkshopId).subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios.' });
      }
    });
  }

  loadPaymentTypes() {
    this.paymentTypesService.load(this.mechanicalWorkshopId).subscribe({
      next: (paymentTypes) => {
        this.paymentTypes = paymentTypes;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de pago.' });
      }
    });
  }

  loadEmployees() {
    this.employeeService.load(this.mechanicalWorkshopId).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los empleados.' });
      }
    });
  }

  loadVehicles() {
    this.vehiclesService.load(this.mechanicalWorkshopId).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los vehículos.' });
      }
    });
  }

  private storePiecesIds(pieces: Piece[]) {
    const piecesIds: number[] = [];
    for (let index = 0; index < pieces.length; index++) {
      piecesIds.push(pieces[index].pieces_id);
    }
    return piecesIds;
  }

  private storeServicesIds(services: Service[]) {
    const servicesIds: number[] = [];
    for (let index = 0; index < services.length; index++) {
      servicesIds.push(services[index].services_id);
    }
    return servicesIds;
  }

}

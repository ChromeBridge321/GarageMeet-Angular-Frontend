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
import { Sale, UpdateSale } from '../models/sales.model';
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
import { ActivatedRoute } from '@angular/router';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-editar',
  imports: [Toast, Button, RouterLink, InputText, AutoCompleteModule, ReactiveFormsModule, FormsModule, CommonModule, Select, DatePicker],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  providers: [MessageService]

})
export class EditarComponent {
  @ViewChild('datepicker') datepicker!: Calendar;
  mechanicalWorkshopId: number;
  saleeForm: FormGroup;
  paymentTypes: PaymentType[] | undefined;
  employees: RESTEmployee[] | undefined;
  vehicles: RESTClient[] | undefined;
  items: any[] = [];
  pieces: Piece[] = [];
  services: Service[] = [];
  sale: Sale | undefined;
  services_sales_id: number;
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
    private readonly vehiclesService: ClientesService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.services_sales_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.mechanicalWorkshopId = this.authService.mechanicalWorkshop()?.id;
    this.saleeForm = this.fb.group({
      services_sales_id: ['', Validators.required],
      payment_types_id: ['', Validators.required],
      employees_id: ['', [Validators.required]],
      vehicles_id: ['', [Validators.required]],
      mechanical_workshops_id: [this.mechanicalWorkshopId],
      date: ['', [Validators.required]],
      price: ['', [Validators.required]],
      services: [[''], [Validators.required]],
      pieces: [[''], [Validators.required]]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.showInfoMessage('Cargando datos de la venta...');
    }, 200);

    this.loadPaymentTypes();
    this.loadEmployees();
    this.loadVehicles();
    this.loadSale();
  }

  updateSale(services: Service[], pieces: Piece[]) {
    const piecesIds: number[] = this.storePiecesIds(pieces);
    const servicesIds: number[] = this.storeServicesIds(services);
    const formattedDate = this.getFormattedDateValue();

    this.saleeForm.patchValue({
      date: formattedDate,
      services: servicesIds,
      pieces: piecesIds
    });
    console.log(this.saleeForm.value);
    this.salesService.update(this.saleeForm.value).subscribe({
      next: () => {
        this.showSuccessMessage('Venta actualizada exitosamente.');
        setTimeout(() => {
          this.router.navigate(['/panel/ventas']);
        }, 1000);

      },
      error: () => {
        this.showErrorMessage('Error al actualizar la venta.');
      }
    });

  }

  loadSale() {
    this.salesService.getSaleById(this.services_sales_id, this.mechanicalWorkshopId).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.saleeForm.setValue({
          services_sales_id: sale.services_sales_id,
          payment_types_id: sale.payment_types_id,
          employees_id: sale.employee.employees_id,
          vehicles_id: sale.vehicle.vehicles_id,
          mechanical_workshops_id: this.mechanicalWorkshopId,
          date: sale.date,
          price: sale.price,
          services: [],
          pieces: []
        });

        this.showSuccessMessage('Datos de la venta cargados exitosamente.');
      },
      error: () => {
        this.showErrorMessage('Error al cargar los datos del empleado.');
      }
    });
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
    if (!pieces) {
      return piecesIds;
    }
    for (let index = 0; index < pieces.length; index++) {
      piecesIds.push(pieces[index].pieces_id);
    }
    return piecesIds;
  }

  private storeServicesIds(services: Service[]) {
    const servicesIds: number[] = [];
    if (!services) {
      return servicesIds;
    }
    for (let index = 0; index < services.length; index++) {
      servicesIds.push(services[index].services_id);
    }
    return servicesIds;
  }

  // Función para formatear la fecha a dd-mm-yy
  private formatDateToDDMMYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0-11
    const year = date.getFullYear().toString().slice(-2); // Obtener los últimos 2 dígitos del año
    return `${year}-${month}-${day}`;
  }

  // Método público para obtener la fecha formateada directamente
  getFormattedDateValue(): string {
    if (this.datepicker && this.datepicker.value) {
      return this.formatDateToDDMMYY(this.datepicker.value);
    }
    return '';
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

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { SubscriptionService } from '../../../../core/services/Subscription.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
// Models y Services
import {
  Sale,
  PaymentType,
  Employee,
  Vehicle,
  ServiceOption,
  PieceOption
} from '../models/sales.model';
import { SalesService } from '../services/sales.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    RouterLink,
    Button,
    TooltipModule,
    Dialog
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  sales: Sale[] = [];
  loading = false;
  submitting = false;
  mechanicalWorkshopId: number;

  // Modal variables
  displayDialog = false;
  displayViewDialog = false;
  isEditing = false;
  selectedSale: Sale | null = null;

  // Dialog para mostrar detalles de la venta
  showDetailsDialog = false;
  saleDetails: Sale | null = null;

  // Form
  saleForm!: FormGroup;

  // Dropdown data
  paymentTypes: PaymentType[] = [];
  employees: Employee[] = [];
  vehicles: Vehicle[] = [];
  services: ServiceOption[] = [];
  pieces: PieceOption[] = [];
  subscriptionService = inject(SubscriptionService);
  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.mechanicalWorkshopId = this.authService.getMechanicalWorkshopData()?.id;
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  // Método para mostrar los detalles de la venta
  showSaleDetails(sale: Sale) {
    this.saleDetails = sale;
    this.showDetailsDialog = true;
  }

  // Getter para verificar suscripción desde el template
  get canModifyData(): boolean {
    return this.subscriptionService.canAccessDashboard();
  }

  showSubscriptionError(): void {
    this.showErrorMessage('Necesitas una suscripción activa para realizar esta acción');
  }
  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    if (!this.mechanicalWorkshopId) {
      console.error('mechanical_workshop_id no está disponible');
      return;
    }

    this.loading = true;
    this.salesService.load(this.mechanicalWorkshopId).subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
        console.log('Ventas cargadas:', this.sales);
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las ventas'
        });
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    // Verificar suscripción antes de eliminar
    if (!this.subscriptionService.canAccessDashboard()) {
      this.showErrorMessage('Necesitas una suscripción activa para eliminar empleados');
      return;
    }

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este empleado?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.salesService.delete(id).subscribe(() => {
          this.loadSales();
          this.showSuccessMessage('Venta eliminada con éxito');
        });
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

  limpiarFiltros(table: any) {
    table.clear();
    // Limpiar también los inputs de filtro por columna
    const filterInputs = document.querySelectorAll('input[pInputText]');
    filterInputs.forEach((input: any) => {
      input.value = '';
    });
  }

}

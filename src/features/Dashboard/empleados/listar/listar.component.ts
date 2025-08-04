import { Component } from '@angular/core';
import { RESTEmployee } from '../models/empleados.model';
import { EmployeeService } from '../services/employee.service';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../../../core/services/Subscription.service';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
@Component({
  selector: 'app-listar',
  imports: [TableModule, Button, RouterLink, Toast, ConfirmDialog, TooltipModule],
  templateUrl: './listar.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ListarComponent implements OnInit {
  employees: RESTEmployee[] = [];
  employeesService = inject(EmployeeService);
  authService = inject(AuthService);
  subscriptionService = inject(SubscriptionService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  loading: boolean = true;
  mechanicarWorshopId: number = this.authService.getMechanicalWorkshopData()?.id;

  // Getter para verificar suscripción desde el template
  get canModifyData(): boolean {
    return this.subscriptionService.canAccessDashboard();
  }

  showSubscriptionError(): void {
    this.showErrorMessage('Necesitas una suscripción activa para realizar esta acción');
  }
  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeesService.load(this.mechanicarWorshopId).subscribe((data) => {
      this.employees = data;
      this.loading = false;
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
        this.employeesService.delete(id).subscribe(() => {
          this.loadEmployees();
          this.showSuccessMessage('Empleado eliminado con éxito');
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
}

import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClientesService } from '../services/clientes.service';
import { RESTClient } from '../models/clientes.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SubscriptionService } from '../../../../core/services/Subscription.service';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-clientes',
  imports: [TableModule, Button, RouterLink, Toast, ConfirmDialog, TooltipModule, CommonModule, FormsModule, InputTextModule],
  templateUrl: './clientes.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ClientesComponent implements OnInit {
  clients: RESTClient[] = [];
  clientesService = inject(ClientesService)
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
    this.loadClients();
  }


  loadClients() {
    this.loading = true;
    this.clientesService.load(this.mechanicarWorshopId).subscribe((data) => {
      this.clients = data;
      this.loading = false;
    });
  }


  delete(peoples_id: number) {
    // Verificar suscripción antes de eliminar
    if (!this.subscriptionService.canAccessDashboard()) {
      this.showErrorMessage('Necesitas una suscripción activa para eliminar clientes');
      return;
    }

    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este cliente?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.clientesService.delete(peoples_id).subscribe(() => {
          this.loadClients();
          this.showSuccessMessage('Cliente eliminado con éxito');
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


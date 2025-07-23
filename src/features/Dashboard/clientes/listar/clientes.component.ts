import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClientesService } from './clientes.service';
import { RESTClient } from '../models/clientes.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';



@Component({
  selector: 'app-clientes',
  imports: [TableModule, Button, RouterLink, Toast, ConfirmDialog],
  templateUrl: './clientes.component.html',
  providers: [MessageService, ConfirmationService],
})
export class ClientesComponent implements OnInit {
  clients: RESTClient[] = [];
  clientesService = inject(ClientesService)
  authService = inject(AuthService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  loading: boolean = true;
  mechanicarWorshopId: number = this.authService.getMechanicalWorkshopData()?.id;

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
}


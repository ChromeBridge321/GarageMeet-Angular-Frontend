import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PaymentMethodsService } from '../AddPaymentMethod/services/PaymentMethod.service';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentMethod } from '../AddPaymentMethod/services/PaymentMethod.service';
@Component({
  selector: 'app-list-payment-methods',
  standalone: true,
  imports: [ CommonModule, RouterLink, TableModule, ButtonModule, Toast, ConfirmDialog, TooltipModule ],
  templateUrl: './ListPaymentMethods.component.html',
  styleUrls: ['./ListPaymentMethods.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ListPaymentMethodsComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  loading = true;

  constructor(
    private paymentMethodsService: PaymentMethodsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.loading = true;
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response.payment_methods;
        this.loading = false;
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los métodos de pago');
        this.loading = false;
        console.error('Error loading payment methods:', error);
      }
    });
  }

  deletePaymentMethod(paymentMethodId: string) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este método de pago?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.paymentMethodsService.deletePaymentMethod(paymentMethodId).subscribe({
          next: () => {
            this.loadPaymentMethods();
            this.showSuccessMessage('Método de pago eliminado exitosamente');
          },
          error: (error) => {
            this.showErrorMessage('Error al eliminar el método de pago');
            console.error('Error deleting payment method:', error);
          }
        });
      }
    });
  }

  isCardExpiringSoon(expMonth: number, expYear: number): boolean {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear();

  // Check if card expires in the next 3 months
  const monthsUntilExpiration = (expYear - currentYear) * 12 + (expMonth - currentMonth);
  return monthsUntilExpiration <= 3 && monthsUntilExpiration >= 0;
}


getCardBrandIcon(brand: string): string {
  const icons: { [key: string]: string } = {
    'visa': 'pi pi-credit-card text-blue-600',
    'mastercard': 'pi pi-credit-card text-red-600',
    'amex': 'pi pi-credit-card text-green-600',
    'discover': 'pi pi-credit-card text-orange-600',
    'unknown': 'pi pi-credit-card text-gray-600'
  };
  return icons[brand.toLowerCase()] || icons['unknown'];
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

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SubscriptionService, SubscriptionStatus } from '../../../core/services/Subscription.service';

@Component({
  selector: 'app-subscription-management',
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, BadgeModule, DialogModule, Toast, ConfirmDialog],
  templateUrl: './SubscriptionManagement.component.html',
  styleUrl: './SubscriptionManagement.component.css',
  providers: [MessageService, ConfirmationService]
})
export class SubscriptionManagementComponent implements OnInit, OnDestroy {
  subscriptionStatus = signal<SubscriptionStatus | null>(null);
  loading = signal(false);
  actionLoading = signal(false);

  private subscriptionStatusSub?: Subscription;

  constructor(
    private subscriptionService: SubscriptionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSubscriptionStatus();

    // Suscribirse a cambios en el estado de suscripción
    this.subscriptionStatusSub = this.subscriptionService.subscriptionStatus$.subscribe(
      status => this.subscriptionStatus.set(status)
    );
  }

  ngOnDestroy(): void {
    this.subscriptionStatusSub?.unsubscribe();
  }

  private loadSubscriptionStatus(): void {
    this.loading.set(true);
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (status) => {
        this.subscriptionStatus.set(status);
        this.loading.set(false);
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar el estado de la suscripción');
        this.loading.set(false);
        console.error('Error loading subscription status:', error);
      }
    });
  }

  cancelSubscription(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cancelar tu suscripción? Seguirás teniendo acceso hasta el final del período actual.',
      header: 'Cancelar Suscripción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No, mantener',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.actionLoading.set(true);
        this.subscriptionService.cancelSubscription().subscribe({
          next: (response) => {
            this.showSuccessMessage(response.message);
            this.loadSubscriptionStatus();
            this.actionLoading.set(false);
          },
          error: (error) => {
            this.showErrorMessage(error.error?.error || 'Error al cancelar la suscripción');
            this.actionLoading.set(false);
            console.error('Error cancelling subscription:', error);
          }
        });
      }
    });
  }

  resumeSubscription(): void {
    this.confirmationService.confirm({
      message: '¿Deseas reactivar tu suscripción? Se reanudará inmediatamente.',
      header: 'Reactivar Suscripción',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí, reactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.actionLoading.set(true);
        this.subscriptionService.resumeSubscription().subscribe({
          next: (response) => {
            this.showSuccessMessage(response.message);
            this.loadSubscriptionStatus();
            this.actionLoading.set(false);
          },
          error: (error) => {
            this.showErrorMessage(error.error?.error || 'Error al reactivar la suscripción');
            this.actionLoading.set(false);
            console.error('Error resuming subscription:', error);
          }
        });
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // getStatusBadgeClass(status: string): string {
  //   const statusClasses: { [key: string]: string } = {
  //     'active': 'success',
  //     'trialing': 'info',
  //     'past_due': 'warning',
  //     'canceled': 'danger',
  //     'unpaid': 'danger',
  //     'incomplete': 'warning'
  //   };
  //   return statusClasses[status] || 'secondary';
  // }

  getStatusBadgeClass(
  status: string
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
  switch (status) {
    case 'active':
      return 'success';
    case 'canceled':
      return 'danger';
    case 'past_due':
      return 'warn';
    case 'incomplete':
      return 'secondary';
    default:
      return 'info';
  }
}

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'active': 'Activa',
      'trialing': 'Período de prueba',
      'past_due': 'Pago pendiente',
      'canceled': 'Cancelada',
      'unpaid': 'Sin pagar',
      'incomplete': 'Incompleta'
    };
    return statusLabels[status] || status;
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

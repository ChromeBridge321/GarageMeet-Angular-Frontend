import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubscriptionService, SubscriptionPlan } from '../../../core/services/Subscription.service';
import { environment } from '../../../eviroments/enviroments';
import { PaymentMethodsService } from '../../Dashboard/AddPaymentMethod/services/PaymentMethod.service';

@Component({
  selector: 'app-subscription-plans',
  imports: [CommonModule, ButtonModule, CardModule, BadgeModule, DialogModule, Toast],
  templateUrl: './SubscriptionPlans.component.html',
  styleUrl: './SubscriptionPlans.component.css',
  providers: [MessageService, SubscriptionService, PaymentMethodsService]
})
export class SubscriptionPlansComponent implements OnInit {
  plans = signal<SubscriptionPlan[]>([]);
  loading = signal(false);
  showPaymentDialog = signal(false);
  selectedPlan = signal<SubscriptionPlan | null>(null);
  subscribing = signal(false);

  stripe: any;
  elements: any;
  cardElement: any;

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentMethodsService: PaymentMethodsService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.loadPlans();
    await this.initializeStripe();
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  private loadPlans() {
    this.loading.set(true);
    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        this.plans.set(response.plans);
        this.loading.set(false);
      },
      error: (error) => {
        this.showErrorMessage('Error al cargar los planes');
        this.loading.set(false);
        console.error('Error loading plans:', error);
      }
    });
  }

  private async initializeStripe() {
    this.stripe = (window as any).Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();

    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });
  }

  selectPlan(plan: SubscriptionPlan) {
    this.selectedPlan.set(plan);
    this.showPaymentDialog.set(true);

    // Montar el elemento de tarjeta cuando se abre el diálogo
    setTimeout(() => {
      if (this.cardElement) {
        this.cardElement.mount('#card-element-subscription');
      }
    }, 100);
  }

  async subscribe() {
    const plan = this.selectedPlan();
    if (!plan || !this.stripe || !this.cardElement) {
      this.showErrorMessage('Error en la configuración del pago');
      return;
    }

    this.subscribing.set(true);

    try {
      // Crear método de pago
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
      });

      if (error) {
        this.showErrorMessage(error.message);
        this.subscribing.set(false);
        return;
      }

      // Crear suscripción
      this.subscriptionService.createSubscription(plan.stripe_price_id, paymentMethod.id).subscribe({
        next: (response) => {
          if (response.requires_action) {
            // Manejar autenticación 3D Secure
            this.handle3DSecure(response.payment_intent);
          } else {
            this.showSuccessMessage('¡Suscripción creada exitosamente!');
            this.closePaymentDialog();
            // Redirigir al dashboard
            setTimeout(() => {
              window.location.href = '/panel';
            }, 2000);
          }
          this.subscribing.set(false);
        },
        error: (error) => {
          this.showErrorMessage(error.error?.error || 'Error al crear la suscripción');
          this.subscribing.set(false);
        }
      });

    } catch (error) {
      this.showErrorMessage('Error inesperado');
      this.subscribing.set(false);
      console.error('Subscription error:', error);
    }
  }

  private async handle3DSecure(paymentIntent: any) {
    const { error } = await this.stripe.confirmCardPayment(paymentIntent.client_secret);

    if (error) {
      this.showErrorMessage(error.message);
    } else {
      this.showSuccessMessage('¡Suscripción creada exitosamente!');
      this.closePaymentDialog();
      setTimeout(() => {
        window.location.href = '/panel';
      }, 2000);
    }
  }

  closePaymentDialog() {
    this.showPaymentDialog.set(false);
    this.selectedPlan.set(null);
    if (this.cardElement) {
      this.cardElement.clear();
    }
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

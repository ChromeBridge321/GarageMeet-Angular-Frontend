import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubscriptionService, SubscriptionPlan } from '../../../core/services/Subscription.service';
import { environment } from '../../../eviroments/enviroments';
import { PaymentMethodsService } from '../../Dashboard/PaymentMethods/services/PaymentMethod.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

declare var Stripe: any;

@Component({
  selector: 'app-subscription-plans',
  imports: [CommonModule, ButtonModule, CardModule, BadgeModule, DialogModule, Toast, RadioButtonModule, FormsModule],
  templateUrl: './SubscriptionPlans.component.html',
  styleUrl: './SubscriptionPlans.component.css',
  providers: [MessageService, SubscriptionService, PaymentMethodsService]
})
export class SubscriptionPlansComponent implements OnInit, OnDestroy {
  plans = signal<SubscriptionPlan[]>([]);
  loading = signal(false);
  showPaymentDialog = signal(false);
  selectedPlan = signal<SubscriptionPlan | null>(null);
  subscribing = signal(false);

  // Properties for payment methods
  existingPaymentMethods = signal<any[]>([]);
  selectedPaymentMethod = signal<string | null>(null);
  loadingPaymentMethods = signal(false);

  // New card dialog properties
  showNewCardDialog = signal(false);
  addingNewCard = signal(false);

  stripe: any;
  elements: any;
  cardElement: any;
  stripeLoaded = signal(false);

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentMethodsService: PaymentMethodsService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.loadPlans();
    await this.initializeStripe();
    this.loadExistingPaymentMethods();
  }

  ngOnDestroy() {
    this.cleanupCardElement();
  }

  private cleanupCardElement() {
    if (this.cardElement) {
      try {
        this.cardElement.unmount();
      } catch (e) {
        console.log('Card element already unmounted');
      }
      try {
        this.cardElement.destroy();
      } catch (e) {
        console.log('Card element already destroyed');
      }
      this.cardElement = null;
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

  private loadExistingPaymentMethods() {
    this.loadingPaymentMethods.set(true);
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (response) => {
        this.existingPaymentMethods.set(response.payment_methods || []);

        // Set default payment method if exists
        const defaultMethod = response.payment_methods?.find((pm: any) => pm.is_default);
        if (defaultMethod) {
          this.selectedPaymentMethod.set(defaultMethod.id);
        } else if (response.payment_methods?.length > 0) {
          this.selectedPaymentMethod.set(response.payment_methods[0].id);
        }

        this.loadingPaymentMethods.set(false);
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.loadingPaymentMethods.set(false);
      }
    });
  }

  private async initializeStripe() {
    return new Promise<void>((resolve) => {
      const checkStripe = () => {
        if (typeof Stripe !== 'undefined') {
          try {
            this.stripe = Stripe(environment.stripePublishableKey);
            this.elements = this.stripe.elements();
            this.stripeLoaded.set(true);
            console.log('Stripe initialized successfully');
            resolve();
          } catch (error) {
            console.error('Error initializing Stripe:', error);
            this.showErrorMessage('Error al cargar el sistema de pagos');
            resolve();
          }
        } else {
          console.log('Waiting for Stripe to load...');
          setTimeout(checkStripe, 100);
        }
      };
      checkStripe();
    });
  }

  selectPlan(plan: SubscriptionPlan) {
    if (!this.stripeLoaded()) {
      this.showErrorMessage('El sistema de pagos aún se está cargando. Inténtalo de nuevo.');
      return;
    }

    this.selectedPlan.set(plan);
    this.showPaymentDialog.set(true);
  }

  // Abrir modal para agregar nueva tarjeta
  openNewCardDialog() {
    this.showNewCardDialog.set(true);

    // Esperar a que el modal se renderice
    setTimeout(() => {
      this.createAndMountCardElement();
    }, 300);
  }

  private createAndMountCardElement() {
    if (!this.stripeLoaded() || !this.elements) {
      console.error('Stripe not properly loaded');
      return;
    }

    // Limpiar elemento existente
    this.cleanupCardElement();

    // Verificar que el contenedor existe
    const cardContainer = document.getElementById('card-element-new');
    if (!cardContainer) {
      console.error('Card container not found');
      setTimeout(() => {
        this.createAndMountCardElement();
      }, 100);
      return;
    }

    try {
      // Crear nuevo elemento
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#aab7c4',
            },
            iconColor: '#666EE8',
          },
          invalid: {
            iconColor: '#FFC7EE',
            color: '#FFC7EE',
          },
        },
        hidePostalCode: true,
      });

      // Montar el elemento
      this.cardElement.mount('#card-element-new');
      console.log('Card element mounted successfully');

      // Event listeners
      this.cardElement.on('ready', () => {
        console.log('Card element is ready for input');
      });

      this.cardElement.on('change', (event: any) => {
        if (event.error) {
          console.error('Card element error:', event.error.message);
        }
      });

    } catch (error) {
      console.error('Error creating/mounting card element:', error);
      this.showErrorMessage('Error al cargar el formulario de tarjeta');
    }
  }

  // Agregar nueva tarjeta
  async addNewCard() {
    if (!this.stripe || !this.cardElement) {
      this.showErrorMessage('Error en la configuración del pago');
      return;
    }

    this.addingNewCard.set(true);

    try {
      // Crear setup intent
      const setupIntentResponse = await this.paymentMethodsService.createSetupIntent().toPromise();

      // Confirmar setup intent con la tarjeta
      const { error, setupIntent } = await this.stripe.confirmCardSetup(
        setupIntentResponse?.client_secret,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: 'Cliente'
            }
          }
        }
      );

      if (error) {
        this.showErrorMessage(error.message);
        this.addingNewCard.set(false);
        return;
      }

      // Verificar que tenemos el payment method ID
      const paymentMethodId = setupIntent.payment_method?.id || setupIntent.payment_method;

      if (!paymentMethodId) {
        this.showErrorMessage('Error: No se pudo obtener el ID del método de pago');
        this.addingNewCard.set(false);
        return;
      }

      console.log('Using payment method ID:', paymentMethodId);

      // Agregar método de pago a la cuenta
      this.paymentMethodsService.attachPaymentMethod(paymentMethodId).subscribe({
        next: () => {
          this.showSuccessMessage('Tarjeta agregada exitosamente');
          this.closeNewCardDialog();
          this.loadExistingPaymentMethods(); // Recargar métodos de pago

          // Seleccionar automáticamente la nueva tarjeta
          setTimeout(() => {
            this.selectedPaymentMethod.set(paymentMethodId);
          }, 500);
        },
        error: (error) => {
          console.error('Error attaching payment method:', error);

          // Manejar diferentes tipos de errores
          if (error.error?.message) {
            if (error.error.message.includes('already attached') ||
                error.error.message.includes('ya está') ||
                error.error.message.includes('payment_method_id')) {
              this.showErrorMessage('Esta tarjeta ya está agregada a tu cuenta');
              // Recargar métodos de pago para mostrar la tarjeta existente
              this.loadExistingPaymentMethods();
              this.closeNewCardDialog();
            } else {
              this.showErrorMessage('Error al guardar la tarjeta: ' + error.error.message);
            }
          } else if (error.error?.errors?.payment_method_id) {
            this.showErrorMessage('Esta tarjeta ya está agregada a tu cuenta');
            this.loadExistingPaymentMethods();
            this.closeNewCardDialog();
          } else {
            this.showErrorMessage('Error al guardar la tarjeta');
          }
        },
        complete: () => {
          this.addingNewCard.set(false);
        }
      });

    } catch (error) {
      this.showErrorMessage('Error inesperado al agregar la tarjeta');
      this.addingNewCard.set(false);
      console.error('Add card error:', error);
    }
  }

  closeNewCardDialog() {
    this.showNewCardDialog.set(false);
    this.cleanupCardElement();
  }

  async subscribe() {
    const plan = this.selectedPlan();
    if (!plan) {
      this.showErrorMessage('Error en la configuración del pago');
      return;
    }

    const paymentMethodId = this.selectedPaymentMethod();
    if (!paymentMethodId) {
      this.showErrorMessage('Por favor selecciona un método de pago');
      return;
    }

    this.subscribing.set(true);

    try {
      console.log('Using payment method:', paymentMethodId);

      // Crear suscripción
      this.subscriptionService.createSubscription(plan.stripe_price_id, paymentMethodId).subscribe({
        next: (response) => {
          if (response.requires_action) {
            this.handle3DSecure(response.payment_intent);
          } else {
            this.showSuccessMessage('¡Suscripción creada exitosamente!');
            this.closePaymentDialog();
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
    try {
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
    } catch (error) {
      this.showErrorMessage('Error en la autenticación 3D Secure');
      console.error('3D Secure error:', error);
    }
  }

  closePaymentDialog() {
    this.showPaymentDialog.set(false);
    this.selectedPlan.set(null);
    this.cleanupCardElement();
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

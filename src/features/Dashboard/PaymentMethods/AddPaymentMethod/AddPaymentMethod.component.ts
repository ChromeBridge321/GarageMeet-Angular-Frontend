import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PaymentMethodsService } from '../services/PaymentMethod.service';
import { environment } from '../../../../eviroments/enviroments';
declare const Stripe: any;
@Component({
  selector: 'app-add-payment-method',
  imports: [ CommonModule, RouterLink, ButtonModule, CardModule, Toast ],
  templateUrl: './AddPaymentMethod.component.html',
  styleUrl: './AddPaymentMethod.component.css',
  providers: [MessageService]
})
export class AddPaymentMethodComponent implements OnInit, OnDestroy {
  stripe: any;
  elements: any;
  cardElement: any;
  isLoading = signal(false);
  clientSecret = signal<string>('');
  existingPaymentMethods = signal<any[]>([]);

  constructor(
    private paymentMethodsService: PaymentMethodsService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.initializeStripe();
    this.createSetupIntent();
    this.loadExistingPaymentMethods();
  }

  ngOnDestroy() {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  private async initializeStripe() {
    // Asegúrate de que tu publishable key esté en el environment
    this.stripe = (window as any).Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();

    // Crear el elemento de tarjeta
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

    // Montar el elemento en el DOM
    setTimeout(() => {
      this.cardElement.mount('#card-element');
    }, 100);
  }

  private loadExistingPaymentMethods() {
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (response) => {
        this.existingPaymentMethods.set(response.payment_methods || []);
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  private createSetupIntent() {
    this.paymentMethodsService.createSetupIntent().subscribe({
      next: (response) => {
        this.clientSecret.set(response.client_secret);
      },
      error: (error) => {
        this.showErrorMessage('Error al inicializar el formulario de pago');
        console.error('Error creating setup intent:', error);
      }
    });
  }

  async addPaymentMethod() {
    if (!this.stripe || !this.cardElement || !this.clientSecret()) {
      this.showErrorMessage('Formulario no inicializado correctamente');
      return;
    }

    this.isLoading.set(true);

    try {
      const { error, setupIntent } = await this.stripe.confirmCardSetup(
        this.clientSecret(),
        {
          payment_method: {
            card: this.cardElement,
          }
        }
      );
      console.log('payment_method:', setupIntent.payment_method);
      if (error) {
        this.showErrorMessage(error.message);
        this.isLoading.set(false);
        return;
      }

      // Verificar que tenemos los datos necesarios
      const newCard = setupIntent.payment_method?.card;
      const paymentMethodId = setupIntent.payment_method?.id;

      if (!paymentMethodId) {
        this.showErrorMessage('Error: No se pudo obtener el ID del método de pago');
        this.isLoading.set(false);
        return;
      }

      // Usar el método de validación del servicio
      if (!this.paymentMethodsService.validateCardData(newCard)) {
        this.showErrorMessage('Error: Los datos de la tarjeta son inválidos o incompletos');
        this.isLoading.set(false);
        console.error('Invalid card data, cannot proceed:', newCard);
        return;
      }

      // Agregar el método de pago al cliente
      this.paymentMethodsService.attachPaymentMethod(paymentMethodId).subscribe({
        next: () => {
          this.showSuccessMessage('Método de pago agregado exitosamente');
          this.isLoading.set(false);
          // Resetear el formulario
          this.cardElement.clear();
          this.createSetupIntent(); // Crear nuevo setup intent
          this.loadExistingPaymentMethods(); // Recargar métodos de pago
        },
        error: (error) => {
          this.showErrorMessage('Error al guardar el método de pago');
          this.isLoading.set(false);
          console.error('Error attaching payment method:', error);
        }
      });

    } catch (error) {
      this.showErrorMessage('Error inesperado');
      this.isLoading.set(false);
      console.error('Unexpected error:', error);
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

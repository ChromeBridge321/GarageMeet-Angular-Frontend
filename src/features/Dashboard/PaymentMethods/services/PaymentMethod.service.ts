import { Injectable } from '@angular/core';
import { environment } from '../../../../eviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { SetupIntent, PaymentMethod} from '../models/PaymentMethods.interface';
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService {

  private baseUrl = `${environment.apiUrl}/payment-methods`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

  }

  createSetupIntent(): Observable<SetupIntent> {
    return this.http.post<SetupIntent>(`${this.baseUrl}/setup-intent`, {}, { headers: this.getHeaders() });
  }

  attachPaymentMethod(paymentMethodId: string): Observable<any> {
    console.log('Sending payment method ID to backend:', paymentMethodId);

    return this.http.post(`${this.baseUrl}/attach`,
      { payment_method_id: paymentMethodId },
      { headers: this.getHeaders() }
    );
  }

  // Nuevo método para validar datos de tarjeta antes de procesar
  validateCardData(cardData: any): boolean {
    return cardData &&
           cardData.last4 &&
           cardData.brand &&
           cardData.exp_month &&
           cardData.exp_year;
  }

  getPaymentMethods(): Observable<{ payment_methods: PaymentMethod[] }> {
    return this.http.get<{ payment_methods: PaymentMethod[] }>(`${this.baseUrl}/list`, { headers: this.getHeaders() });
  }

  deletePaymentMethod(paymentMethodId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete`, {
      headers: this.getHeaders(),
      body: { payment_method_id: paymentMethodId }
    });
  }


}

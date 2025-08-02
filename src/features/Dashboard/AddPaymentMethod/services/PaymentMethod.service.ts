import { Injectable } from '@angular/core';
import { environment } from '../../../../eviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface SetupIntent {
  client_secret: string;
  setup_intent_id: string;
}
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
    return this.http.post(`${this.baseUrl}/attach`,
      { payment_method_id: paymentMethodId },
      { headers: this.getHeaders() }
    );
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

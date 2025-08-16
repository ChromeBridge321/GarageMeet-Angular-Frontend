import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentType, CreatePaymentType, UpdatePaymentType } from '../models/payment-types.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypesService {
  private baseUrl = `${environment.apiUrl}/dashboard/payment-types`;

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

  // Obtener todos los tipos de pago
  load(mechanical_workshops_id: number): Observable<PaymentType[]> {
    return this.http.get<PaymentType[]>(`${this.baseUrl}/list`, {
      headers: this.getHeaders(),
      params: { mechanical_workshops_id: mechanical_workshops_id.toString() }
    });
  }

  // Crear nuevo tipo de pago
  create(paymentType: CreatePaymentType): Observable<PaymentType> {
    return this.http.post<PaymentType>(`${this.baseUrl}/create`, paymentType, {
      headers: this.getHeaders()
    });
  }

  // Obtener tipo de pago por ID
  getById(payment_types_id: number, mechanical_workshops_id: number): Observable<PaymentType> {
    return this.http.get<PaymentType>(`${this.baseUrl}/getById`, {
      headers: this.getHeaders(),
      params: {
        payment_types_id: payment_types_id.toString(),
        mechanical_workshops_id: mechanical_workshops_id.toString()
      }
    });
  }

  // Actualizar tipo de pago
  update(paymentType: UpdatePaymentType): Observable<PaymentType> {
    return this.http.put<PaymentType>(`${this.baseUrl}/update`, paymentType, {
      headers: this.getHeaders()
    });
  }

  // Eliminar tipo de pago
  delete(payment_types_id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete`, {
      headers: this.getHeaders(),
      params: { payment_types_id: payment_types_id.toString() }
    });
  }
}

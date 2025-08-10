import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Sale,
  CreateSale,
  UpdateSale,
  PaymentType,
  Employee,
  Vehicle,
  ServiceOption,
  PieceOption
} from '../models/sales.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseUrl = `${environment.apiUrl}/dashboard/sales`;

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

  // Obtener todas las ventas del taller
  load(mechanical_workshops_id: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${environment.apiUrl}/sales/all`, {
      headers: this.getHeaders(),
      params: { mechanical_workshops_id: mechanical_workshops_id.toString() }
    });
  }

  delete(services_sales_id: number): Observable<Sale[]> {
    return this.http.delete<Sale[]>(`${this.baseUrl}/delete`, {
      headers: this.getHeaders(),
      body: { services_sales_id }
    });
  }

  loadSale(id: number, mechanical_workshops_id: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/getById`, {
      headers: this.getHeaders(),
      params: { id: id, mechanical_workshops_id: mechanical_workshops_id }
    });
  }

  create(sale: CreateSale) {
    return this.http.post<CreateSale>(`${this.baseUrl}/create`, sale, { headers: this.getHeaders() });
  }

  getSaleById(services_sales_id: number, mechanical_workshops_id: number) {
    return this.http.get<Sale>(`${this.baseUrl}/getById`, { headers: this.getHeaders(), params: { services_sales_id, mechanical_workshops_id } });
  }

  update(sale: UpdateSale) {
    return this.http.put<UpdateSale>(`${this.baseUrl}/update`, sale, { headers: this.getHeaders() });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RESTClient } from '../models/clientes.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

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

  load(mechanical_workshops_id: number) {
    return this.http.get<RESTClient[]>(`${environment.apiUrl}/clients/all`, { headers: this.getHeaders(), params: { mechanical_workshops_id } });
  }

  create(cliente: RESTClient) {
    return this.http.post<RESTClient>(`${environment.apiUrl}/clients/create`, cliente, { headers: this.getHeaders() });
  }

  delete(peoples_id: number) {
    return this.http.delete(`${environment.apiUrl}/clients/delete`, { headers: this.getHeaders(), params: { peoples_id } });
  }

  getById(client_id: number, mechanical_workshops_id: number) {
    return this.http.get<RESTClient>(`${environment.apiUrl}/clients/getById`, { headers: this.getHeaders(), params: { client_id, mechanical_workshops_id } });
  }

  update(cliente: RESTClient) {
    return this.http.post(`${environment.apiUrl}/clients/update`, cliente, { headers: this.getHeaders() });
  }
}

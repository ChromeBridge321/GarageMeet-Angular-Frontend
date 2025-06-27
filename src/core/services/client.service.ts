import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../eviroments/enviroments';
import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  DeleteClientRequest,
  ListClientsRequest,
  CreateClientResponse,
  UpdateClientResponse,
  DeleteClientResponse,
  ListClientsResponse
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiUrl = `${environment.apiUrl}/clients`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Crear cliente
  createClient(request: CreateClientRequest): Observable<CreateClientResponse> {
    return this.http.post<CreateClientResponse>(
      `${this.apiUrl}/create`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Actualizar cliente
  updateClient(request: UpdateClientRequest): Observable<UpdateClientResponse> {
    return this.http.post<UpdateClientResponse>(
      `${this.apiUrl}/update`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Eliminar cliente
  deleteClient(request: DeleteClientRequest): Observable<DeleteClientResponse> {
    return this.http.delete<DeleteClientResponse>(
      `${this.apiUrl}/delete`,
      {
        headers: this.getHeaders(),
        body: request
      }
    );
  }

  // Listar clientes
  getAllClients(request: ListClientsRequest): Observable<ListClientsResponse> {
    return this.http.get<ListClientsResponse>(
      `${this.apiUrl}/all`,
      {
        headers: this.getHeaders(),
        params: { mechanical_workshops_id: request.mechanical_workshops_id.toString() }
      }
    );
  }
}

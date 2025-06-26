import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../eviroments/enviroments';
import {
  Position,
  CreatePositionRequest,
  UpdatePositionRequest,
  DeletePositionRequest,
  ListPositionsRequest,
  CreatePositionResponse,
  UpdatePositionResponse,
  DeletePositionResponse,
  ListPositionsResponse
} from '../models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly apiUrl = `${environment.apiUrl}/positions`;

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

  // Crear cargo
  createPosition(request: CreatePositionRequest): Observable<CreatePositionResponse> {
    return this.http.post<CreatePositionResponse>(
      `${this.apiUrl}/create`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Actualizar cargo
  updatePosition(request: UpdatePositionRequest): Observable<UpdatePositionResponse> {
    return this.http.post<UpdatePositionResponse>(
      `${this.apiUrl}/update`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Eliminar cargo
  deletePosition(request: DeletePositionRequest): Observable<DeletePositionResponse> {
    return this.http.delete<DeletePositionResponse>(
      `${this.apiUrl}/delete`,
      {
        headers: this.getHeaders(),
        body: request
      }
    );
  }

  // Listar cargos
  getAllPositions(request: ListPositionsRequest): Observable<ListPositionsResponse> {
    return this.http.get<ListPositionsResponse>(
      `${this.apiUrl}/all`,
      {
        headers: this.getHeaders(),
        params: { mechanical_workshops_id: request.mechanical_workshops_id.toString() }
      }
    );
  }
}

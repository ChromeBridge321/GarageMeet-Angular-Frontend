import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RESTPositions } from '../models/cargos.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';
import { Position } from '../../empleados/models/empleados.model';
@Injectable({
  providedIn: 'root'
})
export class CargosService {
  private baseUrl = `${environment.apiUrl}/positions/all`;
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
    return this.http.get<RESTPositions[]>(this.baseUrl, { headers: this.getHeaders(), params: { mechanical_workshops_id } });
  }

  create(Position: Position) {
    return this.http.post<RESTPositions>(`${environment.apiUrl}/positions/create`, Position, { headers: this.getHeaders() });
  }

  delete(positions_id: number) {
    return this.http.delete(`${environment.apiUrl}/positions/delete`, { headers: this.getHeaders(), params: { positions_id } });
  }

  getById(positions_id: number, mechanical_workshops_id: number) {
    return this.http.get<RESTPositions>(`${environment.apiUrl}/positions/getById`, { headers: this.getHeaders(), params: { positions_id, mechanical_workshops_id } });
  }

  update(position: RESTPositions) {
    return this.http.put<RESTPositions>(`${environment.apiUrl}/positions/update`, position, { headers: this.getHeaders() });
  }
}

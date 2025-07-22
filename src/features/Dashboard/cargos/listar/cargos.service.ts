import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RESTPositions } from '../models/cargos.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';
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

  listar(mechanical_workshops_id: number) {
    return this.http.get<RESTPositions[]>(this.baseUrl, { headers: this.getHeaders(), params: { mechanical_workshops_id } });
  }
}

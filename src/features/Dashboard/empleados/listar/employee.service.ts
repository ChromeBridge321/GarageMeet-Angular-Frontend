import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../eviroments/enviroments';
import { RESTEmployee } from '../models/empleados.model';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient,
    private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listar(mechanical_workshops_id: number) {
    return this.http.get<RESTEmployee[]>(`${environment.apiUrl}/employees/all`, { headers: this.getHeaders(), params: { mechanical_workshops_id } });
  }

  crear(employee: RESTEmployee) {
    return this.http.post<RESTEmployee>(`${environment.apiUrl}/employees/create`, employee, { headers: this.getHeaders() });
  }
}

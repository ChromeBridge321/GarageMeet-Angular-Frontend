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

  load(mechanical_workshops_id: number) {
    return this.http.get<RESTEmployee[]>(`${environment.apiUrl}/employees/all`, { headers: this.getHeaders(), params: { mechanical_workshops_id } });
  }

  create(employee: RESTEmployee) {
    return this.http.post<RESTEmployee>(`${environment.apiUrl}/employees/create`, employee, { headers: this.getHeaders() });
  }

  delete(peoples_id: number) {
    return this.http.delete(`${environment.apiUrl}/employees/delete`, { headers: this.getHeaders(), params: { peoples_id } });
  }

  getEmployeeById(employee_id: number, mechanical_workshops_id: number) {
    return this.http.get<RESTEmployee>(`${environment.apiUrl}/employees/getById`, { headers: this.getHeaders(), params: { employee_id, mechanical_workshops_id } });
  }

  update(employee: RESTEmployee) {
    return this.http.put<RESTEmployee>(`${environment.apiUrl}/employees/update`, employee, { headers: this.getHeaders() });
  }
}

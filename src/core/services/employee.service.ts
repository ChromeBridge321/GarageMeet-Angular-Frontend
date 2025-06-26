import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../eviroments/enviroments';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  DeleteEmployeeRequest,
  ListEmployeesRequest,
  CreateEmployeeResponse,
  UpdateEmployeeResponse,
  DeleteEmployeeResponse,
  ListEmployeesResponse
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

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

  // Crear empleado
  createEmployee(request: CreateEmployeeRequest): Observable<CreateEmployeeResponse> {
    return this.http.post<CreateEmployeeResponse>(
      `${this.apiUrl}/create`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Actualizar empleado
  updateEmployee(request: UpdateEmployeeRequest): Observable<UpdateEmployeeResponse> {
    return this.http.post<UpdateEmployeeResponse>(
      `${this.apiUrl}/update`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Eliminar empleado
  deleteEmployee(request: DeleteEmployeeRequest): Observable<DeleteEmployeeResponse> {
    return this.http.delete<DeleteEmployeeResponse>(
      `${this.apiUrl}/delete`,
      {
        headers: this.getHeaders(),
        body: request
      }
    );
  }

  // Listar empleados
  getAllEmployees(request: ListEmployeesRequest): Observable<ListEmployeesResponse> {
    return this.http.get<ListEmployeesResponse>(
      `${this.apiUrl}/all`,
      {
        headers: this.getHeaders(),
        params: { mechanical_workshops_id: request.mechanical_workshops_id.toString() }
      }
    );
  }
}

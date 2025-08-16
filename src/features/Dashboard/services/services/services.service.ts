import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, CreateService, UpdateService } from '../models/services.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private baseUrl = `${environment.apiUrl}/dashboard/services`;

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

  // Obtener todos los servicios del taller
  load(mechanical_workshops_id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${environment.apiUrl}/services/all`, {
      headers: this.getHeaders(),
      params: { mechanical_workshops_id: mechanical_workshops_id.toString() }
    });
  }

  // Obtener un servicio por ID
  getServiceById(id: number, mechanical_workshops_id: number): Observable<Service> {
    return this.http.get<any>(`${environment.apiUrl}/services/getById`, {
      headers: this.getHeaders(),
      params: {
        services_id: id.toString(),
        mechanical_workshops_id: mechanical_workshops_id.toString()
      }
    }).pipe(
      map(response => {
        console.log('Respuesta getServiceById:', response);
        return response.service || response;
      })
    );
  }

  // Crear un nuevo servicio
  create(serviceData: Omit<CreateService, 'mechanical_workshops_id'>, mechanical_workshops_id: number): Observable<Service> {
    const createData: CreateService = {
      ...serviceData,
      mechanical_workshops_id: mechanical_workshops_id
    };

    console.log('Datos enviados para crear servicio:', createData);

    return this.http.post<any>(`${this.baseUrl}/create`, createData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Respuesta createService:', response);
        return response.data || response;
      })
    );
  }

  // Actualizar un servicio existente
  update(id: number, serviceData: Omit<UpdateService, 'services_id' | 'mechanical_workshops_id'>, mechanical_workshops_id: number): Observable<Service> {
    const updateData: UpdateService = {
      services_id: id,
      mechanical_workshops_id: mechanical_workshops_id,
      ...serviceData
    };

    console.log('Datos enviados para actualizar servicio:', updateData);

    return this.http.put<any>(`${this.baseUrl}/update`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Respuesta updateService:', response);
        return response.data || response;
      })
    );
  }

  // Eliminar un servicio
  delete(id: number, mechanical_workshops_id: number): Observable<any> {
    console.log('Eliminando servicio con ID:', id, 'del workspace:', mechanical_workshops_id);

    return this.http.delete(`${this.baseUrl}/delete`, {
      headers: this.getHeaders(),
      params: {
        services_id: id.toString(),
        mechanical_workshops_id: mechanical_workshops_id.toString()
      }
    });
  }

  getByName(name: string, mechanical_workshops_id: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/getByName`, {
      headers: this.getHeaders(),
      params: {
        name: name,
        mechanical_workshops_id: mechanical_workshops_id
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Model } from './models/vehiculo.model';
import { Make } from './models/vehiculo.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getModels() {
    return this.http.get<Model[]>(`${this.baseUrl}/vehiclesService/getAllModels`, { headers: this.getHeaders() });
  }

  getMakes() {
    return this.http.get<Make[]>(`${this.baseUrl}/vehiclesService/getAllMakes`, { headers: this.getHeaders() });
  }

  getMakesByName(name: string) {
    return this.http.get<Make[]>(`${this.baseUrl}/vehiclesService/getMakeByName`, { headers: this.getHeaders(), params: { name } });
  }

  getModelsByName(name: string) {
    return this.http.get<Model[]>(`${this.baseUrl}/vehiclesService/getModelByName`, { headers: this.getHeaders(), params: { name } });
  }

}

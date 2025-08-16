import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../eviroments/enviroments';
import { MechanicalCreate } from '../model/mw.model';
@Injectable({
  providedIn: 'root'
})
export class CreateMechanicalWorkshopService {
  private baseUrl = `${environment.apiUrl}/mechanicals`;
  constructor(private http: HttpClient,
    private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  create(mechanical: MechanicalCreate) {
    return this.http.post(`${this.baseUrl}/create`, mechanical, { headers: this.getHeaders() });
  }

}

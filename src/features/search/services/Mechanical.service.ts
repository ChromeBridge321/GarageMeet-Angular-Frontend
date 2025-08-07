import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../eviroments/enviroments';
import { MechanicalREST } from '../models/mechanicalW.model';
@Injectable({
  providedIn: 'root'
})
export class MechanicalService {
  private apiUrl = `${environment.apiUrl}/mechanicals`;
  constructor(private http: HttpClient) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  getMechanicalWorkshopsByCity(stateId: number, cityId: number): Observable<MechanicalREST[]> {
    return this.http.get<MechanicalREST[]>(`${this.apiUrl}/getByStateAndCity/${stateId}/${cityId}`, { headers: this.headers });
  }

}

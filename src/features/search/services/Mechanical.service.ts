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
  getMechanicalWorkshopsByLocation(type: 'state' | 'municipality', locationId: number): Observable<MechanicalREST[]> {
    return this.http.get<MechanicalREST[]>(
      `${this.apiUrl}/by-location/${type}/${locationId}`,
      { headers: this.headers }
    );
  }

}

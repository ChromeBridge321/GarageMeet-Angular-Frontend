import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../eviroments/enviroments';
import { LocationOption } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private apiUrl = `${environment.apiUrl}/locations`;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) { }

  search(query: string): Observable<LocationOption[]> {
    const params = new HttpParams().set('q', query.trim());
    return this.http.get<LocationOption[]>(`${this.apiUrl}/search`, {
      headers: this.headers,
      params
    });
  }

  getStates(): Observable<LocationOption[]> {
    return this.http.get<LocationOption[]>(`${this.apiUrl}/states`, {
      headers: this.headers
    });
  }

  getMunicipalitiesByState(stateId: number): Observable<LocationOption[]> {
    return this.http.get<LocationOption[]>(
      `${this.apiUrl}/states/${stateId}/municipalities`,
      { headers: this.headers }
    );
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../eviroments/enviroments';
import { CitiesREST } from '../models/cities.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private apiUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  searchCitiesByName(name: string): Observable<CitiesREST[]> {
    return this.http.get<CitiesREST[]>(`${this.apiUrl}/findByName/${name}`, { headers: this.headers });
  }
}


import { Injectable } from '@angular/core';
import { environment } from '../../../eviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDTO } from '../models/auth.dto';
import { tap } from 'rxjs';
import { AuthResponse } from '../../../core/models/authResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = `${environment.apiUrl}/auth/register`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  register(userData: RegisterDTO) {
    return this.http.post<AuthResponse>(`${this.baseUrl}`, userData).pipe(
      tap((response) => this.authService.setAuthState(response))
    );
  }
}

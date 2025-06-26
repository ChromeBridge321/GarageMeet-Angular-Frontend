import { Injectable } from '@angular/core';
import { environment } from '../../../eviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDTO } from '../models/auth.dto';
import { tap } from 'rxjs';
import { AuthResponse } from '../../../core/models/authResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = `${environment.apiUrl}/auth/login`;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }
  login(credentials: LoginDTO) {
    return this.http.post<AuthResponse>(`${this.baseUrl}`, credentials).pipe(
      tap((response) => this.authService.setAuthState(response))
    );
  }
}

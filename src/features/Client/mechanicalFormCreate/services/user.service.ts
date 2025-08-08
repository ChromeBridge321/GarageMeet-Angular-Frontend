import { Injectable } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../eviroments/enviroments';
import { UserModel } from '../model/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient,
    private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  updateUserRol(userRolId: number) {
    return this.http.put(`${this.baseUrl}/update`, { type_users_id: userRolId }, { headers: this.getHeaders() });
  }
}

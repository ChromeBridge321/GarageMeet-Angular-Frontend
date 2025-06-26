import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse } from '../models/authResponse';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals para estado reactivo (Angular 17+)
  private readonly authState = signal<AuthResponse | null>(null);
  public token = computed(() => {
    // Prefer token in authState, fallback to stored token
    return this.authState()?.token || sessionStorage.getItem('authToken');
  });
  public isLoggedIn = computed(() => !!this.token());


  // Inicializar desde almacenamiento
  constructor() {
    // Load stored token and user data
    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = this.getSecureStorage('userData');
    if (storedToken && storedUser) {
      // Reconstruct full auth state
      this.authState.set({ token: storedToken, ...storedUser });
    }
  }

  // Métodos públicos
  setAuthState(response: AuthResponse): void {
    // Store full response in memory
    this.authState.set(response);
    // Persist token and separate user data
    sessionStorage.setItem('authToken', response.token);
  }


  logout(): void {
    this.authState.set(null);
    sessionStorage.removeItem('authToken');
    this.clearSecureStorage('userData');
  }

  // Almacenamiento seguro (abstracción)
  private setSecureStorage(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  private getSecureStorage(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private clearSecureStorage(key: string): void {
    sessionStorage.removeItem(key);
  }
}

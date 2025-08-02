import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../eviroments/enviroments';
import { AuthService } from './auth.service';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  stripe_price_id: string;
  stripe_product_id: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  can_access_dashboard: boolean;
  subscription?: {
    id: string;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    plan: SubscriptionPlan;
  };
}


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}`;
  private subscriptionStatusSubject = new BehaviorSubject<SubscriptionStatus | null>(null);
  public subscriptionStatus$ = this.subscriptionStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Cargar estado de suscripción al inicializar el servicio
    if (this.authService.isLoggedIn()) {
      this.loadSubscriptionStatus();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPlans(): Observable<{ plans: SubscriptionPlan[] }> {
    return this.http.get<{ plans: SubscriptionPlan[] }>(`${this.baseUrl}/subscription-plans`);
  }

  createSubscription(priceId: string, paymentMethodId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscriptions/create`, {
      price_id: priceId,
      payment_method_id: paymentMethodId
    }, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadSubscriptionStatus())
    );
  }

  getSubscriptionStatus(): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.baseUrl}/subscriptions/status`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(status => this.subscriptionStatusSubject.next(status))
    );
  }

  private loadSubscriptionStatus(): void {
    this.getSubscriptionStatus().subscribe({
      error: (error) => console.error('Error loading subscription status:', error)
    });
  }

  cancelSubscription(): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscriptions/cancel`, {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => this.loadSubscriptionStatus())
    );
  }

  resumeSubscription(): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscriptions/resume`, {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => this.loadSubscriptionStatus())
    );
  }

  // Métodos de utilidad
  hasActiveSubscription(): boolean {
    const status = this.subscriptionStatusSubject.value;
    return status?.has_subscription && status?.can_access_dashboard || false;
  }

  canAccessDashboard(): boolean {
    const status = this.subscriptionStatusSubject.value;
    return status?.can_access_dashboard || false;
  }

      // Agregar este método para obtener el estado actual de suscripción
  getCurrentSubscriptionStatus(): SubscriptionStatus | null {
    return this.subscriptionStatusSubject.value;
  }

        isSubscriptionCancelled(): boolean {
    const status = this.subscriptionStatusSubject.value;
    return status?.subscription?.cancel_at_period_end || false;
  }
}

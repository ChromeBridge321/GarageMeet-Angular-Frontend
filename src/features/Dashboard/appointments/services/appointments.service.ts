import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';
import { CreaCita, RESTCita } from '../models/citas.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getAllAppointments(): Observable<RESTCita[]> {
    const mechanicalWorkshopId = this.authService.getWorkshopId();
    return this.http.get<RESTCita[]>(
      `${this.baseUrl}/dashboard/appointments/all?mechanical_workshops_id=${mechanicalWorkshopId}`,
      { headers: this.getHeaders() }
    );
  }

  getAppointmentById(appointmentId: number): Observable<any> {
    const body = {
      appointment_id: appointmentId
    };

    return this.http.post<any>(
      `${this.baseUrl}/dashboard/appointments/getById`,
      body,
      { headers: this.getHeaders() }
    );
  }

  confirmAppointment(appointmentId: number, confirmedDate: string, confirmedTime: string, notes?: string): Observable<any> {
    const body = {
      appointment_id: appointmentId,
      confirmed_date: confirmedDate,
      confirmed_time: confirmedTime,
      notes: notes
    };

    return this.http.post<any>(
      `${this.baseUrl}/dashboard/appointments/confirm`,
      body,
      { headers: this.getHeaders() }
    );
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    const body = {
      appointment_id: appointmentId,
    };

    return this.http.post<any>(
      `${this.baseUrl}/dashboard/appointments/cancel`,
      body,
      { headers: this.getHeaders() }
    );
  }

  updateAppointment(appointmentData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/dashboard/appointments/update`,
      appointmentData,
      { headers: this.getHeaders() }
    );
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    const body = {
      appointment_id: appointmentId
    };

    return this.http.delete<any>(
      `${this.baseUrl}/dashboard/appointments/delete`,
      {
        headers: this.getHeaders(),
        body: body
      }
    );
  }

  markAsCompleted(appointmentId: number): Observable<any> {
    const body = {
      appointment_id: appointmentId
    };

    return this.http.post<any>(
      `${this.baseUrl}/dashboard/appointments/mark-completed`,
      body,
      { headers: this.getHeaders() }
    );
  }

  sendReminder(appointmentId: number): Observable<any> {
    const body = {
      appointment_id: appointmentId
    };

    return this.http.post<any>(
      `${this.baseUrl}/dashboard/appointments/send-reminder`,
      body,
      { headers: this.getHeaders() }
    );
  }

  requestAppointment(appointmentData: CreaCita): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/appointments/request`,
      appointmentData,
      { headers: this.getHeaders() }
    );
  }
}

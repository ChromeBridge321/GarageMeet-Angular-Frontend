import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Piece, CreatePiece, UpdatePiece } from '../models/pieces.model';
import { environment } from '../../../../eviroments/enviroments';
import { AuthService } from '../../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PiecesService {
  private baseUrl = `${environment.apiUrl}/dashboard/pieces`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todas las piezas del taller
  load(mechanical_workshops_id: number): Observable<Piece[]> {
    return this.http.get<Piece[]>(`${this.baseUrl}/list`, {
      headers: this.getHeaders(),
      params: { mechanical_workshops_id: mechanical_workshops_id.toString() }
    });
  }

  // Obtener una pieza por ID
  getPieceById(id: number, mechanical_workshops_id: number): Observable<Piece> {
    return this.http.get<any>(`${environment.apiUrl}/pieces/${id}`, {
      headers: this.getHeaders(),
      params: { mechanical_workshops_id: mechanical_workshops_id.toString() }
    }).pipe(
      map(response => {
        console.log('Respuesta getPieceById:', response);
        return response.piece || response;
      })
    );
  }

  // Crear una nueva pieza
  create(pieceData: Omit<CreatePiece, 'mechanical_workshops_id'>, mechanical_workshops_id: number): Observable<Piece> {
    const createData: CreatePiece = {
      ...pieceData,
      mechanical_workshops_id: mechanical_workshops_id
    };

    console.log('Datos enviados para crear pieza:', createData);

    return this.http.post<any>(`${this.baseUrl}/create`, createData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Respuesta createPiece:', response);
        return response.piece || response;
      })
    );
  }

  // Actualizar una pieza existente
  update(id: number, pieceData: Omit<UpdatePiece, 'pieces_id'>): Observable<Piece> {
    const updateData: UpdatePiece = {
      pieces_id: id,
      ...pieceData
    };

    console.log('Datos enviados para actualizar pieza:', updateData);

    return this.http.put<any>(`${this.baseUrl}/update`, updateData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Respuesta updatePiece:', response);
        return response.piece || response;
      })
    );
  }

  // Eliminar una pieza
  delete(id: number, mechanical_workshops_id: number): Observable<any> {
    console.log('Eliminando pieza con ID:', id, 'del workspace:', mechanical_workshops_id);

    return this.http.delete(`${this.baseUrl}/delete`, {
      headers: this.getHeaders(),
      params: { pieces_id: id}
    });
  }

  getByName(name: string, mechanical_workshops_id: number): Observable<Piece[]> {
    return this.http.get<Piece[]>(`${this.baseUrl}/getByName`, {
      headers: this.getHeaders(),
      params: { name: name, mechanical_workshops_id: mechanical_workshops_id }
    });
  }
}

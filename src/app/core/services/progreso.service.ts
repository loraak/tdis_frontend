import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoDTO } from '../models/progreso';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private apiUrl = `${environment.apiUrl}/progreso`;

  constructor(private http: HttpClient) {}

  obtenerPorMatricula(matricula: string): Observable<ProgresoDTO> {
    return this.http.get<ProgresoDTO>(`${this.apiUrl}/matricula/${matricula}`);
  }

  obtenerPorId(alumnoId: string): Observable<ProgresoDTO> {
    return this.http.get<ProgresoDTO>(`${this.apiUrl}/${alumnoId}`);
  }
}

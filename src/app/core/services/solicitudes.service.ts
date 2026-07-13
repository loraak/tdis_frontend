import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearSolicitudRequest, SolicitudDTO, RevisarSolicitudRequest } from '../models/solicitud';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<SolicitudDTO[]> {
    return this.http.get<SolicitudDTO[]>(this.apiUrl);
  }

  listarPorAlumno(alumnoId: string): Observable<SolicitudDTO[]> {
    return this.http.get<SolicitudDTO[]>(`${this.apiUrl}/alumno/${alumnoId}`);
  }

  listarPorEstado(estado: string): Observable<SolicitudDTO[]> {
    return this.http.get<SolicitudDTO[]>(`${this.apiUrl}/estado/${estado}`);
  }

  listarPorAlumnoYEstado(alumnoId: string, estado: string): Observable<SolicitudDTO[]> {
    return this.http.get<SolicitudDTO[]>(`${this.apiUrl}/alumno/${alumnoId}/estado/${estado}`);
  }

  obtenerPorId(id: string): Observable<SolicitudDTO> {
    return this.http.get<SolicitudDTO>(`${this.apiUrl}/${id}`);
  }

  crear(request: CrearSolicitudRequest): Observable<SolicitudDTO> {
    return this.http.post<SolicitudDTO>(this.apiUrl, request);
  }

  analizarIA(solicitudId: string): Observable<SolicitudDTO> {
    return this.http.post<SolicitudDTO>(`${this.apiUrl}/${solicitudId}/analizar-ia`, {});
  }

  revisar(id: string, request: RevisarSolicitudRequest): Observable<SolicitudDTO> {
    return this.http.put<SolicitudDTO>(`${this.apiUrl}/${id}/revisar`, request);
  }
}

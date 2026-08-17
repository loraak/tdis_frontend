import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadDTO } from '../models/actividad';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private apiUrl = `${environment.apiUrl}/catalogo`;

  constructor(private http: HttpClient) {}

  listarActivas(): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(this.apiUrl);
  }

  listarTodas(): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiUrl}?todas=true`);
  }

  listarPorEstadoRevision(estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'): Observable<ActividadDTO[]> {
    const params = new HttpParams().set('estadoRevision', estado);
    return this.http.get<ActividadDTO[]>(this.apiUrl, { params });
  }

  listarPorCreador(creadorId: string): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiUrl}/creador/${creadorId}`);
  }

  listarPorEje(eje: string): Observable<ActividadDTO[]> {
    return this.http.get<ActividadDTO[]>(`${this.apiUrl}/eje/${eje}`);
  }

  obtenerPorId(id: string): Observable<ActividadDTO> {
    return this.http.get<ActividadDTO>(`${this.apiUrl}/${id}`);
  }

  crear(actividad: ActividadDTO): Observable<ActividadDTO> {
    return this.http.post<ActividadDTO>(this.apiUrl, actividad);
  }

  actualizar(id: string, actividad: ActividadDTO): Observable<ActividadDTO> {
    return this.http.put<ActividadDTO>(`${this.apiUrl}/${id}`, actividad);
  }

  desactivar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activar(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/activar`, {});
  }

  revisar(id: string, estado: 'APROBADA' | 'RECHAZADA', comentario?: string): Observable<ActividadDTO> {
    let params = new HttpParams().set('estado', estado);
    if (comentario) {
      params = params.set('comentario', comentario);
    }
    return this.http.post<ActividadDTO>(`${this.apiUrl}/${id}/revisar`, {}, { params });
  }

  crearDesdePrevia(solicitudId: string, creadorId: string, creadorTipo: string, puntosTdi: number): Observable<ActividadDTO> {
    const params = new HttpParams()
      .set('creadorId', creadorId)
      .set('creadorTipo', creadorTipo)
      .set('puntosTdi', puntosTdi);
    return this.http.post<ActividadDTO>(`${this.apiUrl}/desde-previa/${solicitudId}`, {}, { params });
  }
}

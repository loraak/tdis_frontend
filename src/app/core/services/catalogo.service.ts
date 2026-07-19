import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

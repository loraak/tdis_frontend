import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminResumenDTO, AlumnoResumenDTO } from '../models/admin';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<AdminResumenDTO> {
    return this.http.get<AdminResumenDTO>(`${this.apiUrl}/resumen`);
  }

  listarAlumnos(): Observable<AlumnoResumenDTO[]> {
    return this.http.get<AlumnoResumenDTO[]>(`${this.apiUrl}/alumnos`);
  }
}

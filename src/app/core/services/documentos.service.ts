import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private apiUrl = `${environment.apiUrl}/documentos`;

  constructor(private http: HttpClient) {}

  subirArchivo(solicitudId: string, archivo: File): Observable<{ nombreAlmacenado: string; nombreOriginal: string }> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<{ nombreAlmacenado: string; nombreOriginal: string }>(
      `${this.apiUrl}/upload/${solicitudId}`,
      formData
    );
  }

  descargarArchivo(solicitudId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${solicitudId}`, {
      responseType: 'blob',
    });
  }

  eliminarArchivo(solicitudId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${solicitudId}`);
  }
}

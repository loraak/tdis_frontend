import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { SolicitudDTO } from '../../core/models/solicitud';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.css',
})
export class MisSolicitudes implements OnInit {
  private solicitudesService = inject(SolicitudesService);
  private auth = inject(Auth);
  private router = inject(Router);

  solicitudes: SolicitudDTO[] = [];
  expandedId: string | null = null;
  loading = true;

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    const user = this.auth.usuario();
    if (!user) return;
    const alumnoId = user.usuarioId;
    this.solicitudesService.listarPorAlumno(alumnoId).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: string): boolean {
    return this.expandedId === id;
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'status-badge-review',
      'APROBADA': 'status-badge-approved',
      'RECHAZADA': 'status-badge-rejected',
    };
    return map[estado] || 'status-badge-review';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'En revisión',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
    };
    return map[estado] || estado;
  }

  estadoIcon(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
    };
    return map[estado] || 'pi pi-clock';
  }

  nuevaSolicitud() {
    this.router.navigate(['/alumno/solicitud']);
  }

  get totalSolicitudes(): number { return this.solicitudes.length; }
  get enRevision(): number { return this.solicitudes.filter(s => s.estado === 'EN_REVISION').length; }
  get aprobadas(): number { return this.solicitudes.filter(s => s.estado === 'APROBADA').length; }
  get rechazadas(): number { return this.solicitudes.filter(s => s.estado === 'RECHAZADA').length; }
}

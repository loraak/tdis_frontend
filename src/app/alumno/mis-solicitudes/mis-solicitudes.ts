import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
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
export class MisSolicitudes implements OnInit, OnDestroy {
  private solicitudesService = inject(SolicitudesService);
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  solicitudes: SolicitudDTO[] = [];
  expandedId: string | null = null;
  loading = true;
  filtroActivo: 'EVIDENCIA' | 'PREVIA' = 'EVIDENCIA';

  ngOnInit() {
    this.cargarSolicitudes();
  }

  ngOnDestroy() {
    this.detenerPolling();
  }

  cargarSolicitudes() {
    const user = this.auth.usuario();
    if (!user) return;
    const alumnoId = user.usuarioId;
    this.solicitudesService.listarPorAlumno(alumnoId).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
        this.iniciarPollingSiHayPendientes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private iniciarPollingSiHayPendientes() {
    const hayPendientes = this.solicitudes.some(
      s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA'
    );

    if (hayPendientes && !this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        const user = this.auth.usuario();
        if (!user) return;
        this.solicitudesService.listarPorAlumno(user.usuarioId).subscribe({
          next: (data) => {
            this.solicitudes = data;
            const todaviaPendientes = this.solicitudes.some(
              s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA'
            );
            if (!todaviaPendientes) {
              this.detenerPolling();
            }
            this.cdr.detectChanges();
          },
        });
      }, 5000);
    }

    if (!hayPendientes) {
      this.detenerPolling();
    }
  }

  private detenerPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
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
      'REVISION_HUMANA': 'status-badge-review',
    };
    return map[estado] || 'status-badge-review';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'En revisión',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
      'REVISION_HUMANA': 'En revisión',
    };
    return map[estado] || estado;
  }

  estadoIcon(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
      'REVISION_HUMANA': 'pi pi-clock',
    };
    return map[estado] || 'pi pi-clock';
  }

  cardBorderClass(estado: string): string {
    const map: Record<string, string> = {
      'APROBADA': 'card-border-approved',
      'RECHAZADA': 'card-border-rejected',
      'EN_REVISION': 'card-border-review',
      'REVISION_HUMANA': 'card-border-review',
    };
    return map[estado] || 'card-border-review';
  }

  enviarNuevaEvidencia(sol: SolicitudDTO) {
    this.router.navigate(['/alumno/nueva-solicitud'], {
      queryParams: { actividadId: sol.actividadId }
    });
  }

  nuevaSolicitud() {
    this.router.navigate(['/alumno/nueva-solicitud']);
  }

  get totalSolicitudes(): number { return this.solicitudesFiltradas.length; }
  get enRevision(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA').length; }
  get aprobadas(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'APROBADA').length; }
  get rechazadas(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'RECHAZADA').length; }

  get solicitudesFiltradas(): SolicitudDTO[] {
    return this.solicitudes.filter(s => s.tipoSolicitud === this.filtroActivo);
  }

  get totalEvidencias(): number { return this.solicitudes.filter(s => s.tipoSolicitud === 'EVIDENCIA').length; }
  get totalPrevias(): number { return this.solicitudes.filter(s => s.tipoSolicitud === 'PREVIA').length; }

  cambiarFiltro(filtro: 'EVIDENCIA' | 'PREVIA') {
    this.filtroActivo = filtro;
    this.expandedId = null;
    this.cdr.detectChanges();
  }
}

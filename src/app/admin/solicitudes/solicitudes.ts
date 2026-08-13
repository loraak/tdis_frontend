import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { SolicitudDTO } from '../../core/models/solicitud';

@Component({
  selector: 'app-solicitudes',
  imports: [CardModule, TagModule, CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {
  private solicitudesService = inject(SolicitudesService);
  private cdr = inject(ChangeDetectorRef);

  solicitudes: SolicitudDTO[] = [];
  filtroEstado: string = 'TODO';
  filtroActivo: 'EVIDENCIA' | 'PREVIA' = 'EVIDENCIA';
  expandedId: string | null = null;
  loading = true;

  nuevoComentario: string = '';

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;
    this.solicitudesService.listarTodas().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get solicitudesFiltradas(): SolicitudDTO[] {
    let resultado = this.solicitudes.filter(s => s.tipoSolicitud === this.filtroActivo);
    if (this.filtroEstado === 'TODO') return resultado;
    if (this.filtroEstado === 'EN_REVISION') return resultado.filter(s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA');
    return resultado.filter(s => s.estado === this.filtroEstado);
  }

  setFiltro(estado: string) {
    this.filtroEstado = estado;
  }

  cambiarFiltroTipo(filtro: 'EVIDENCIA' | 'PREVIA') {
    this.filtroActivo = filtro;
    this.expandedId = null;
    this.cdr.detectChanges();
  }

  get totalEvidencias(): number { return this.solicitudes.filter(s => s.tipoSolicitud === 'EVIDENCIA').length; }
  get totalPrevias(): number { return this.solicitudes.filter(s => s.tipoSolicitud === 'PREVIA').length; }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: string): boolean {
    return this.expandedId === id;
  }

  aprobar(sol: SolicitudDTO) {
    this.solicitudesService.revisar(sol.id, { estado: 'APROBADA', comentario: this.nuevoComentario || undefined })
      .subscribe({ next: () => {
        this.nuevoComentario = '';
        this.cargarSolicitudes();
      }});
  }

  rechazar(sol: SolicitudDTO) {
    const motivo = prompt('Motivo de rechazo:');
    if (!motivo) return;
    this.solicitudesService.revisar(sol.id, { estado: 'RECHAZADA', comentario: motivo })
      .subscribe({ next: () => this.cargarSolicitudes() });
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
      'REVISION_HUMANA': 'Revisión IA',
    };
    return map[estado] || estado;
  }

  estadoIcon(estado: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
      'REVISION_HUMANA': 'pi pi-spin pi-spinner',
    };
    return map[estado] || 'pi pi-clock';
  }

  get totalSolicitudes(): number { return this.solicitudesFiltradas.length; }
  get pendientes(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA').length; }
  get aprobadas(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'APROBADA').length; }
  get rechazadas(): number { return this.solicitudesFiltradas.filter(s => s.estado === 'RECHAZADA').length; }
}

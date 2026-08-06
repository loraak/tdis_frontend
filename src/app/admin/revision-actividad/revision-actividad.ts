import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CatalogoService } from '../../core/services/catalogo.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-revision-actividad',
  imports: [CommonModule, FormsModule, CardModule, TagModule],
  templateUrl: './revision-actividad.html',
  styleUrl: './revision-actividad.css',
})
export class RevisionActividad {
  private cdr = inject(ChangeDetectorRef);
  private catalogoService = inject(CatalogoService);

  expandedId: string | null = null;
  loading = true;
  nuevoComentario: string = '';
  actividades: ActividadDTO[] = [];

  filtroEstado: 'TODO' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' = 'PENDIENTE';

  ngOnInit() {
    this.catalogoService.listarTodas().subscribe({
      next: (data) => {
        this.actividades = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.actividades = [];
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get totalActividades(): number {
    return this.actividades.length;
  }

  get pendientes(): number {
    return this.actividades.filter(a => a.estadoRevision === 'PENDIENTE').length;
  }

  get aprobadas(): number {
    return this.actividades.filter(a => a.estadoRevision === 'APROBADA').length;
  }

  get rechazadas(): number {
    return this.actividades.filter(a => a.estadoRevision === 'RECHAZADA').length;
  }

  get actividadesFiltradas(): ActividadDTO[] {
    if (this.filtroEstado === 'TODO') return this.actividades;
    return this.actividades.filter(a => a.estadoRevision === this.filtroEstado);
  }

  setFiltro(filtro: 'TODO' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'): void {
    this.filtroEstado = filtro;
  }

  isExpanded(id: string): boolean {
    return this.expandedId === id;
  }

  toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  estadoRevisionLabel(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
    };
    return map[estado || ''] || '—';
  }

  estadoRevisionBadgeClass(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'badge-pending',
      'APROBADA': 'badge-success',
      'RECHAZADA': 'badge-inactive',
    };
    return map[estado || ''] || 'badge-pending';
  }

  estadoRevisionIcon(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
    };
    return map[estado || ''] || 'pi pi-clock';
  }

  activaLabel(activa: boolean): string {
    return activa ? 'Activa' : 'Inactiva';
  }

  activaIcon(activa: boolean): string {
    return activa ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  activaBadgeClass(activa: boolean): string {
    return activa ? 'badge-success' : 'badge-inactive';
  }

  ejeLabel(eje: ActividadDTO['eje']): string {
    const labels: Record<ActividadDTO['eje'], string> = {
      ENTORNO_SOCIAL: 'Entorno Social',
      PERSONAL: 'Personal',
      DEPORTIVO: 'Deportivo',
      TRASCENDENCIA: 'Trascendencia'
    };
    return labels[eje] ?? eje;
  }

  periodicidadLabel(periodicidad: ActividadDTO['periodicidad']): string {
    const labels: Record<ActividadDTO['periodicidad'], string> = {
      UNICA: 'Única ocasión',
      SEMANAL: 'Semanal',
      MENSUAL: 'Mensual'
    };
    return labels[periodicidad] ?? periodicidad;
  }

  aprobar(act: ActividadDTO): void {
    this.catalogoService.revisar(act.id, 'APROBADA').subscribe({
      next: (updated) => {
        const idx = this.actividades.findIndex(a => a.id === act.id);
        if (idx >= 0) {
          this.actividades[idx] = { ...this.actividades[idx], ...updated };
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error aprobando:', err);
        alert(err.error?.message || 'No se pudo aprobar la actividad');
      },
    });
  }

  rechazar(act: ActividadDTO): void {
    const comentario = this.nuevoComentario?.trim();
    if (!comentario) {
      alert('Debes proporcionar un comentario para rechazar la actividad');
      return;
    }
    this.catalogoService.revisar(act.id, 'RECHAZADA', comentario).subscribe({
      next: (updated) => {
        const idx = this.actividades.findIndex(a => a.id === act.id);
        if (idx >= 0) {
          this.actividades[idx] = { ...this.actividades[idx], ...updated };
        }
        this.nuevoComentario = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error rechazando:', err);
        alert(err.error?.message || 'No se pudo rechazar la actividad');
      },
    });
  }

  activar(act: ActividadDTO): void {
    this.catalogoService.activar(act.id).subscribe({
      next: () => {
        const idx = this.actividades.findIndex(a => a.id === act.id);
        if (idx >= 0) {
          this.actividades[idx] = { ...this.actividades[idx], activa: true };
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error activando:', err);
        alert(err.error?.message || 'No se pudo activar la actividad');
      },
    });
  }

  desactivar(act: ActividadDTO): void {
    this.catalogoService.desactivar(act.id).subscribe({
      next: () => {
        const idx = this.actividades.findIndex(a => a.id === act.id);
        if (idx >= 0) {
          this.actividades[idx] = { ...this.actividades[idx], activa: false };
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error desactivando:', err);
        alert(err.error?.message || 'No se pudo desactivar la actividad');
      },
    });
  }
}

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { Auth } from '../../core/services/auth';
import { ActividadDTO } from '../../core/models/actividad';
import { SolicitudDTO } from '../../core/models/solicitud';

@Component({
  selector: 'app-revision-actividad',
  imports: [CommonModule, FormsModule, CardModule, TagModule, DialogModule, InputTextModule],
  templateUrl: './revision-actividad.html',
  styleUrl: './revision-actividad.css',
})
export class RevisionActividad {
  private cdr = inject(ChangeDetectorRef);
  private catalogoService = inject(CatalogoService);
  private solicitudesService = inject(SolicitudesService);
  private auth = inject(Auth);

  expandedId: string | null = null;
  loading = true;
  nuevoComentario: string = '';
  solicitudesPrevias: SolicitudDTO[] = [];
  loadingPrevias = true;
  actividades: ActividadDTO[] = [];
  modalAprobarVisible = false;
  puntosTDI = 0;
  ejeSeleccionado: ActividadDTO['eje'] | '' = '';

  // Modals para PREVIA
  modalAprobarPreviaVisible = false;
  modalRechazarPreviaVisible = false;
  previaAprobando: SolicitudDTO | null = null;
  puntosTDIPrevia = 0;
  motivoRechazoPrevia = '';

  filtroEstado: 'TODO' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' = 'PENDIENTE';

  ngOnInit() {
    this.cargarSolicitudesPrevias();
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

  cargarSolicitudesPrevias() {
    this.loadingPrevias = true;
    this.solicitudesService.listarTodas().subscribe({
      next: (data) => {
        this.solicitudesPrevias = data.filter(s => s.tipoSolicitud === 'PREVIA');
        this.loadingPrevias = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando previas:', err);
        this.solicitudesPrevias = [];
        this.loadingPrevias = false;
        this.cdr.markForCheck();
      },
    });
  }

  get totalActividades(): number {
    return this.solicitudesPrevias.length + this.actividades.length;
  }

  get pendientes(): number {
    return this.solicitudesPrevias.filter(s => s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA').length + this.actividades.filter(a => a.estadoRevision === 'PENDIENTE').length;
  }

  get aprobadas(): number {
    return this.solicitudesPrevias.filter(s => s.estado === 'APROBADA').length + this.actividades.filter(a => a.estadoRevision === 'APROBADA').length;
  }

  get rechazadas(): number {
    return this.solicitudesPrevias.filter(s => s.estado === 'RECHAZADA').length + this.actividades.filter(a => a.estadoRevision === 'RECHAZADA').length;
  }

  get solicitudesPreviasFiltradas(): SolicitudDTO[] {
    if (this.filtroEstado === 'TODO') return this.solicitudesPrevias;
    const mapEstado: Record<string, string[]> = {
      'PENDIENTE': ['EN_REVISION', 'REVISION_HUMANA'],
      'APROBADA': ['APROBADA'],
      'RECHAZADA': ['RECHAZADA'],
    };
    const estados = mapEstado[this.filtroEstado] || [];
    return this.solicitudesPrevias.filter(s => estados.includes(s.estado));
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

  estadoSolicitudLabel(estado?: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'En revisión',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
      'REVISION_HUMANA': 'Revisión IA',
    };
    return map[estado || ''] || '—';
  }

  estadoSolicitudBadgeClass(estado?: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'status-badge-review',
      'APROBADA': 'status-badge-approved',
      'RECHAZADA': 'status-badge-rejected',
      'REVISION_HUMANA': 'status-badge-review',
    };
    return map[estado || ''] || 'status-badge-review';
  }

  estadoSolicitudIcon(estado?: string): string {
    const map: Record<string, string> = {
      'EN_REVISION': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
      'REVISION_HUMANA': 'pi pi-spin pi-spinner',
    };
    return map[estado || ''] || 'pi pi-clock';
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

  periodicidadLabel(periodicidad: string | undefined): string {
    const labels: Record<string, string> = {
      UNICA: 'Única ocasión',
      SEMANAL: 'Semanal',
      MENSUAL: 'Mensual'
    };
    return labels[periodicidad || ''] ?? periodicidad ?? '—';
  }

  actividadAprobando: ActividadDTO | null = null;

  abrirModalAprobar(act: ActividadDTO): void {
    this.actividadAprobando = act;
    this.puntosTDI = act.puntosTdi || 0;
    this.ejeSeleccionado = act.eje || '';
    this.modalAprobarVisible = true;
  }

  confirmarAprobacion(): void {
    if (!this.actividadAprobando) return;
    if (!this.puntosTDI || !this.ejeSeleccionado) {
      alert('Debes proporcionar los puntos TDI y el eje');
      return;
    }
    const act = this.actividadAprobando;
    this.modalAprobarVisible = false;
    // Actualizar puntos y eje primero
    const actualizada = { ...act, puntosTdi: this.puntosTDI, eje: this.ejeSeleccionado as ActividadDTO['eje'] };
    this.catalogoService.actualizar(act.id, actualizada).subscribe({
      next: () => {
        this.catalogoService.revisar(act.id, 'APROBADA').subscribe({
          next: (updated) => {
            const idx = this.actividades.findIndex(a => a.id === act.id);
            if (idx >= 0) {
              const original = this.actividades[idx];
              // Actualizar solo los campos que vienen del servicio y los nuevos puntos/eje
              this.actividades[idx] = {
                ...original,
                estadoRevision: updated?.estadoRevision ?? original.estadoRevision,
                comentarioRevision: updated?.comentarioRevision ?? original.comentarioRevision,
                puntosTdi: this.puntosTDI,
                eje: this.ejeSeleccionado as ActividadDTO['eje'],
              };
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error aprobando:', err);
            alert(err.error?.message || 'No se pudo aprobar la actividad');
          },
        });
      },
      error: (err) => {
        console.error('Error actualizando actividad:', err);
        alert(err.error?.message || 'No se pudo actualizar los datos de la actividad');
      },
    });
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

  aprobarPrevia(sol: SolicitudDTO): void {
    this.previaAprobando = sol;
    this.puntosTDIPrevia = 0;
    this.modalAprobarPreviaVisible = true;
  }

  confirmarAprobarPrevia(): void {
    if (!this.previaAprobando) return;
    if (!this.puntosTDIPrevia || this.puntosTDIPrevia < 1) {
      alert('Debes ingresar los puntos TDI (mínimo 1)');
      return;
    }
    const sol = this.previaAprobando;
    this.modalAprobarPreviaVisible = false;

    // Llamar endpoint para convertir PREVIA a Actividad en catálogo
    this.catalogoService.crearDesdePrevia(sol.id, this.getCurrentUserId(), this.getCurrentUserRol(), this.puntosTDIPrevia)
      .subscribe({
        next: () => {
          // Marcar la solicitud como aprobada
          this.solicitudesService.revisar(sol.id, { estado: 'APROBADA', comentario: undefined }).subscribe({
            next: () => {
              this.cargarSolicitudesPrevias();
              this.cdr.markForCheck();
            },
            error: (err) => {
              console.error('Error aprobando solicitud:', err);
              alert(err.error?.message || 'No se pudo aprobar la solicitud');
            }
          });
        },
        error: (err) => {
          console.error('Error creando actividad desde previa:', err);
          console.error('Error status:', err.status);
          console.error('Error body:', err.error);
          const msg = err.error?.message || err.error?.error || JSON.stringify(err.error) || 'No se pudo crear la actividad desde la solicitud';
          alert(msg);
        }
      });
  }

  abrirModalRechazarPrevia(sol: SolicitudDTO): void {
    this.previaAprobando = sol;
    this.motivoRechazoPrevia = '';
    this.modalRechazarPreviaVisible = true;
  }

  confirmarRechazarPrevia(): void {
    if (!this.previaAprobando) return;
    if (!this.motivoRechazoPrevia?.trim()) {
      alert('Debes proporcionar un motivo de rechazo');
      return;
    }
    const sol = this.previaAprobando;
    this.modalRechazarPreviaVisible = false;

    this.solicitudesService.revisar(sol.id, { estado: 'RECHAZADA', comentario: this.motivoRechazoPrevia }).subscribe({
      next: () => {
        this.cargarSolicitudesPrevias();
        this.motivoRechazoPrevia = '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error rechazando solicitud:', err);
        alert(err.error?.message || 'No se pudo rechazar la solicitud');
      }
    });
  }

  private getCurrentUserId(): string {
    const user = this.auth.usuario();
    return user?.usuarioId || '';
  }

  private getCurrentUserRol(): string {
    const user = this.auth.usuario();
    return user?.tipoUsuario || 'ADMINISTRADOR';
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

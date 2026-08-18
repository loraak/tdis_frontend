import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CatalogoService } from '../../core/services/catalogo.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-actividades',
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css',
})
export class Actividades {
  private router = inject(Router);
  private catalogoService = inject(CatalogoService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  expandedId: string | null = null;
  loading = true;
  actividades: ActividadDTO[] = [];

  ngOnInit() {
    const user = this.auth.usuario();
    if (user?.usuarioId) {
      this.catalogoService.listarPorCreador(user.usuarioId).subscribe({
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
    } else {
      this.actividades = [];
      this.loading = false;
    }
  }

  get totalActividades(): number {
    return this.actividades.length;
  }

  get activas(): number {
    return this.actividades.filter(a => a.activa).length;
  }

  get enRevision(): number {
    return this.actividades.filter(a => a.estadoRevision === 'PENDIENTE').length;
  }

  get aprobadas(): number {
    return this.actividades.filter(a => a.estadoRevision === 'APROBADA').length;
  }

  get rechazadas(): number {
    return this.actividades.filter(a => a.estadoRevision === 'RECHAZADA').length;
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: string): boolean {
    return this.expandedId === id;
  }

  estadoRevisionLabel(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'En revisión',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
    };
    return map[estado || ''] || '—';
  }

  estadoRevisionBadgeClass(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'status-badge-review',
      'APROBADA': 'status-badge-approved',
      'RECHAZADA': 'status-badge-rejected',
    };
    return map[estado || ''] || 'status-badge-review';
  }

  estadoRevisionIcon(estado?: string): string {
    const map: Record<string, string> = {
      'PENDIENTE': 'pi pi-clock',
      'APROBADA': 'pi pi-check-circle',
      'RECHAZADA': 'pi pi-times-circle',
    };
    return map[estado || ''] || 'pi pi-clock';
  }

  cardBorderClass(activa: boolean): string {
    return activa ? 'card-border-approved' : 'card-border-rejected';
  }

  nuevaActividad() {
    const rol = this.auth.rol();
    if (rol === 'INTERNO') this.router.navigate(['/interno/nueva-actividad']);
    else if (rol === 'EXTERNO') this.router.navigate(['/externo/nueva-actividad']);
    else this.router.navigate(['/']);
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
      MENSUAL: 'Mensual',
      CUATRIMESTRAL: 'Cuatrimestral',
      ANUAL: 'Anual'
    };
    return labels[periodicidad] ?? periodicidad;
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
}

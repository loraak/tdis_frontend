import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-revision-actividad',
  imports: [CommonModule, FormsModule, CardModule, TagModule],
  templateUrl: './revision-actividad.html',
  styleUrl: './revision-actividad.css',
})
export class RevisionActividad {
  private cdr = inject(ChangeDetectorRef);

  expandedId: string | null = null;
  loading = true;

  nuevoComentario: string = '';
  //actividades: ActividadDTO[] = [];
  actividades: ActividadDTO[] = [
    {
      id: '1',
      titulo: 'Jornada de Reforestación Campus UTEQ',
      descripcion: 'Actividad de plantación de árboles nativos en las áreas verdes del campus, con el objetivo de fomentar la conciencia ambiental entre los estudiantes.',
      eje: 'ENTORNO_SOCIAL',
      puntosTdi: 50,
      periodicidad: 'UNICA',
      fechaInicio: '2026-08-15',
      fechaFin: undefined,
      activa: true,
      createdAt: new Date('2026-07-01')
    },
    {
      id: '2',
      titulo: 'Taller de Inteligencia Emocional',
      descripcion: 'Serie de sesiones semanales orientadas al desarrollo de habilidades de autoconocimiento, manejo del estrés y regulación emocional.',
      eje: 'PERSONAL',
      puntosTdi: 30,
      periodicidad: 'SEMANAL',
      fechaInicio: '2026-08-03',
      fechaFin: '2026-09-25',
      activa: true,
      createdAt: new Date('2026-07-10')
    },
    {
      id: '3',
      titulo: 'Liga Interna de Fútbol Rápido',
      descripcion: 'Torneo deportivo entre grupos de las diferentes divisiones académicas, promoviendo el trabajo en equipo y la actividad física.',
      eje: 'DEPORTIVO',
      puntosTdi: 40,
      periodicidad: 'MENSUAL',
      fechaInicio: '2026-08-10',
      fechaFin: '2026-11-10',
      activa: true,
      createdAt: new Date('2026-07-05')
    },
    {
      id: '4',
      titulo: 'Voluntariado en Asilo de Ancianos',
      descripcion: 'Visitas periódicas a un asilo local para realizar actividades recreativas y de acompañamiento con adultos mayores.',
      eje: 'TRASCENDENCIA',
      puntosTdi: 60,
      periodicidad: 'MENSUAL',
      fechaInicio: '2026-08-20',
      fechaFin: '2027-01-20',
      activa: true,
      createdAt: new Date('2026-07-12')
    },
    {
      id: '6',
      titulo: 'Colecta de Alimentos para Comunidades Vulnerables',
      descripcion: 'Campaña de recolección y distribución de despensas básicas en colonias cercanas a la institución.',
      eje: 'ENTORNO_SOCIAL',
      puntosTdi: 45,
      periodicidad: 'UNICA',
      fechaInicio: '2026-09-12',
      fechaFin: undefined,
      activa: true,
      createdAt: new Date('2026-07-18')
    },
    {
      id: '7',
      titulo: 'Torneo de Ajedrez Universitario',
      descripcion: 'Competencia individual y por equipos que busca fomentar el pensamiento estratégico y la sana competencia.',
      eje: 'DEPORTIVO',
      puntosTdi: 25,
      periodicidad: 'UNICA',
      fechaInicio: '2026-09-20',
      fechaFin: undefined,
      activa: false,
      createdAt: new Date('2026-06-28')
    },
    {
      id: '10',
      titulo: 'Rally Deportivo Multidisciplinario',
      descripcion: 'Evento que combina distintas disciplinas deportivas en formato de circuito, dirigido a todas las divisiones académicas.',
      eje: 'DEPORTIVO',
      puntosTdi: 35,
      periodicidad: 'UNICA',
      fechaInicio: '2026-11-08',
      fechaFin: undefined,
      activa: true,
      createdAt: new Date('2026-07-16')
    }
  ];

  ngOnInit() {
  }
  filtroEstado: 'TODO' | 'ACTIVA' | 'INACTIVA' = 'TODO';

  private expandedIds = new Set<string>();

  get totalActividades(): number {
    return this.actividades.length;
  }

  get activas(): number {
    return this.actividades.filter(a => a.activa).length;
  }

  get inactivas(): number {
    return this.actividades.filter(a => !a.activa).length;
  }

  get actividadesFiltradas(): ActividadDTO[] {
    if (this.filtroEstado === 'TODO') return this.actividades;
    const wantActiva = this.filtroEstado === 'ACTIVA';
    return this.actividades.filter(a => a.activa === wantActiva);
  }

  setFiltro(filtro: 'TODO' | 'ACTIVA' | 'INACTIVA'): void {
    this.filtroEstado = filtro;
  }

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  toggleExpand(id: string): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
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

  activar(act: ActividadDTO): void {
    act.activa = true;
    // Aquí iría tu llamada al servicio, ej:
    // this.actividadService.actualizar(act.id, { activa: true }).subscribe();
  }

  desactivar(act: ActividadDTO): void {
    act.activa = false;
    // this.actividadService.actualizar(act.id, { activa: false }).subscribe();
  }

}

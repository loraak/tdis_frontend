import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../core/services/admin.service';
import { AdminResumenDTO, AlumnoResumenDTO } from '../../core/models/admin';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  private adminService = inject(AdminService);
  private cd = inject(ChangeDetectorRef);

  recompensas = [
    { nivel: 'Explorador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Promotor', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Líder', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Embajador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  resumenData: AdminResumenDTO | null = null;
  alumnos: AlumnoResumenDTO[] = [];
  actividades: ActividadDTO[] = [];
  /*
  alumnos: AlumnoResumenDTO[] = [
    { id: '1', matricula: '20231001', nombre: 'Sofía', apellidos: 'Ramírez Torres', nivel: 'Embajador', personal: 320, social: 280, dep: 210, trasc: 290, total: 1100, createdAt: new Date('2026-06-20') },
    { id: '2', matricula: '20231002', nombre: 'Diego', apellidos: 'Hernández Cruz', nivel: 'Embajador', personal: 300, social: 260, dep: 240, trasc: 250, total: 1050, createdAt: new Date('2026-07-08') },
    { id: '3', matricula: '20231003', nombre: 'Valentina', apellidos: 'López Medina', nivel: 'Líder', personal: 180, social: 150, dep: 160, trasc: 140, total: 630, createdAt: new Date('2026-07-08') },
    { id: '4', matricula: '20231004', nombre: 'Emiliano', apellidos: 'Gómez Rivas', nivel: 'Líder', personal: 170, social: 160, dep: 130, trasc: 150, total: 610, createdAt: new Date('2026-07-05') },
    { id: '5', matricula: '20231005', nombre: 'Camila', apellidos: 'Sánchez Ortiz', nivel: 'Líder', personal: 160, social: 140, dep: 150, trasc: 155, total: 605, createdAt: new Date('2026-06-28') },
    { id: '6', matricula: '20231006', nombre: 'Mateo', apellidos: 'Fernández Solís', nivel: 'Promotor', personal: 90, social: 85, dep: 80, trasc: 75, total: 330, createdAt: new Date('2026-07-09') },
    { id: '7', matricula: '20231007', nombre: 'Regina', apellidos: 'Castillo Vega', nivel: 'Promotor', personal: 85, social: 90, dep: 70, trasc: 65, total: 310, createdAt: new Date('2026-07-10') }
  ];
  actividades: ActividadDTO[] = [
    {
      id: "01",
      titulo: "Voluntariado en Comedor Comunitario",
      descripcion: "Participación activa en la preparación y distribución de alimentos para personas en situación de vulnerabilidad.",
      eje: "ENTORNO_SOCIAL",
      puntosTdi: 5,
      temporalidad: "Mensual",
      activa: true,
      createdAt: new Date("2026-07-01")
    },
    {
      id: "02",
      titulo: "Taller de Manejo del Tiempo y Productividad",
      descripcion: "Curso práctico sobre técnicas de organización como Pomodoro y bloques de tiempo para mejorar el rendimiento diario.",
      eje: "PERSONAL",
      puntosTdi: 3,
      temporalidad: "Única vez",
      activa: true,
      createdAt: new Date("2026-07-02")
    },
    {
      id: "03",
      titulo: "Torneo de Fútbol Intercolegial",
      descripcion: "Inscripción y participación en el torneo de fútbol de la liga interna del campus.",
      eje: "DEPORTIVO",
      puntosTdi: 2,
      temporalidad: "Semestral",
      activa: true,
      createdAt: new Date("2026-07-02")
    },
    {
      id: "04",
      titulo: "Retiro de Reflexión y Propósito de Vida",
      descripcion: "Espacio de introspección guiada para la definición de metas a largo plazo y valores fundamentales.",
      eje: "TRASCENDENCIA",
      puntosTdi: 5,
      temporalidad: "Anual",
      activa: true,
      createdAt: new Date("2026-07-03")
    },
    {
      id: "05",
      titulo: "Campaña de Reforestación Urbana",
      descripcion: "Plantación de árboles nativos en zonas designadas de la ciudad para mejorar los espacios verdes.",
      eje: "ENTORNO_SOCIAL",
      puntosTdi: 5,
      temporalidad: "Única vez",
      activa: false,
      createdAt: new Date("2026-07-04")
    },
    {
      id: "06",
      titulo: "Club de Lectura Semanal",
      descripcion: "Sesiones de discusión sobre literatura contemporánea y desarrollo de habilidades críticas.",
      eje: "PERSONAL",
      puntosTdi: 4,
      temporalidad: "Semanal",
      activa: true,
      createdAt: new Date("2026-07-04")
    },
    {
      id: "07",
      titulo: "Rutina Diaria de Cardio y Fuerza",
      descripcion: "Seguimiento y registro de actividad física en el gimnasio institucional.",
      eje: "DEPORTIVO",
      puntosTdi: 3,
      temporalidad: "Diaria",
      activa: true,
      createdAt: new Date("2026-07-08")
    }
  ];
  */
  maxPuntosEje = 1;

  ngOnInit() {
    //this.cargarDatos();
  }

  cargarDatos() {
    this.adminService.obtenerResumen().subscribe((data) => {
      this.resumenData = data;
      this.alumnos = data.topAlumnos;
      this.maxPuntosEje = Math.max(1, ...Object.values(data.puntosPorEje));
      this.cd.markForCheck();
    });
    //this.actividades = [];
  }

  get totalAlumnos(): number { return this.resumenData?.totalAlumnos ?? 0; }
  get actividadesAprobadas(): number { return this.resumenData?.actividadesAprobadas ?? 0; }
  get actividadesRechazadas(): number { return this.resumenData?.actividadesRechazadas ?? 0; }
  get puntosDistribuidos(): number { return this.resumenData?.puntosDistribuidos ?? 0; }

  get niveles(): { label: string; count: number }[] {
    const d = this.resumenData?.distribucionNiveles;
    if (!d) return [];
    return Object.entries(d).map(([nivel, count]) => ({ label: nivel, count }));
  }

  get totalEnNiveles(): number {
    return this.niveles.reduce((sum, n) => sum + n.count, 0);
  }

  puntosEje(eje: string): number {
    return this.resumenData?.puntosPorEje?.[eje] ?? 0;
  }

  alturaEje(eje: string): number {
    return (this.puntosEje(eje) / this.maxPuntosEje) * 100;
  }

  ejeLabel(key: string): string {
    const map: Record<string, string> = {
      'PERSONAL': 'Personal',
      'ENTORNO_SOCIAL': 'Entorno Social',
      'DEPORTIVO': 'Deportivo',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[key] || key;
  }

  get barEjes(): string[] {
    return ['PERSONAL', 'ENTORNO_SOCIAL', 'DEPORTIVO', 'TRASCENDENCIA'];
  }

  nivelLabel(key: string): string {
    const map: Record<string, string> = {
      'EXPLORADOR': 'Explorador',
      'PROMOTOR': 'Promotor',
      'LÍDER': 'Líder',
      'EMBAJADOR': 'Embajador',
    };
    return map[key.toUpperCase()] || key;
  }

  /*
  async onGenerarReporteAlumnos(): Promise<void> {
    this.generandoReporte = true;
    try {
      await this.reporteService.generarReporteAlumnos(
        this.alumnos,
        //this.resumenData?.distribucionNiveles ?? {},
        //this.resumenData?.puntosPorEje ?? {}
        DISTRIBUCION_NIVELES_MOCK, PUNTOS_POR_EJE_MOCK
      );
    } finally {
      this.generandoReporte = false;
    }
  }

  async onGenerarReporteActividades(): Promise<void> {
    this.generandoReporte = true;
    try {
      const distribucionEjes = this.actividades.reduce((acc, act) => {
        acc[act.eje] = (acc[act.eje] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const distribucionTemporalidad = this.actividades.reduce((acc, act) => {
        acc[act.temporalidad] = (acc[act.temporalidad] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      await this.reporteService.generarReporteActividades({
        actividades: this.actividades,
        distribucionEjes,
        distribucionTemporalidad
      });

    } finally {
      this.generandoReporte = false;
    }
  }
    */
}

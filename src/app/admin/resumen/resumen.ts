import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../core/services/admin.service';
import { AdminResumenDTO, AlumnoResumenDTO } from '../../core/models/admin';
import { ActividadDTO } from '../../core/models/actividad';
import { ReporteService } from '../../core/services/reporte.service';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  private adminService = inject(AdminService);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private reporteService: ReporteService
  ){}

  recompensas = [
    { nivel: 'Explorador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Promotor', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Líder', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Embajador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  resumenData: AdminResumenDTO | null = null;
  //alumnos: AlumnoResumenDTO[] = [];
  //actividades: ActividadDTO[] = [];
  
  alumnos: AlumnoResumenDTO[] = [
  { id: '1', matricula: '20231001', nombre: 'Sofía', apellidos: 'Ramírez Torres', nivel: '', personal: 18, social: 16, dep: 14, trasc: 17, total: 65, createdAt: new Date('2026-06-20') }, // graduada
  { id: '3', matricula: '20231003', nombre: 'Valentina', apellidos: 'López Medina', nivel: '', personal: 15, social: 12, dep: 13, trasc: 13, total: 53, createdAt: new Date('2026-07-08') }, // Embajador, casi
  { id: '6', matricula: '20231006', nombre: 'Mateo', apellidos: 'Fernández Solís', nivel: '', personal: 9, social: 8, dep: 8, trasc: 8, total: 33, createdAt: new Date('2026-07-09') }, // Líder justo
  { id: '9', matricula: '20231009', nombre: 'Ximena', apellidos: 'Reyes Ibarra', nivel: '', personal: 5, social: 4, dep: 4, trasc: 4, total: 17, createdAt: new Date('2026-07-11') }, // Promotor
  { id: '12', matricula: '20231012', nombre: 'Bruno', apellidos: 'Delgado Rosales', nivel: '', personal: 2, social: 1, dep: 1, trasc: 0, total: 4, createdAt: new Date('2026-06-25') }, // Explorador
];
  actividades: ActividadDTO[] = [
    {
      id: "01",
      titulo: "Voluntariado en Comedor Comunitario",
      descripcion: "Participación activa en la preparación y distribución de alimentos para personas en situación de vulnerabilidad.",
      eje: "ENTORNO_SOCIAL",
      puntosTdi: 5,
      periodicidad: "MENSUAL",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-01")
    },
    {
      id: "02",
      titulo: "Taller de Manejo del Tiempo y Productividad",
      descripcion: "Curso práctico sobre técnicas de organización como Pomodoro y bloques de tiempo para mejorar el rendimiento diario.",
      eje: "PERSONAL",
      puntosTdi: 3,
      periodicidad: "UNICA",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-02")
    },
    {
      id: "03",
      titulo: "Torneo de Fútbol Intercolegial",
      descripcion: "Inscripción y participación en el torneo de fútbol de la liga interna del campus.",
      eje: "DEPORTIVO",
      puntosTdi: 2,
      periodicidad: "SEMANAL",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-02")
    },
    {
      id: "04",
      titulo: "Retiro de Reflexión y Propósito de Vida",
      descripcion: "Espacio de introspección guiada para la definición de metas a largo plazo y valores fundamentales.",
      eje: "TRASCENDENCIA",
      puntosTdi: 5,
      periodicidad: "MENSUAL",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-03")
    },
    {
      id: "05",
      titulo: "Campaña de Reforestación Urbana",
      descripcion: "Plantación de árboles nativos en zonas designadas de la ciudad para mejorar los espacios verdes.",
      eje: "ENTORNO_SOCIAL",
      puntosTdi: 5,
      periodicidad: "UNICA",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: false,
      createdAt: new Date("2026-07-04")
    },
    {
      id: "06",
      titulo: "Club de Lectura Semanal",
      descripcion: "Sesiones de discusión sobre literatura contemporánea y desarrollo de habilidades críticas.",
      eje: "PERSONAL",
      puntosTdi: 4,
      periodicidad: "SEMANAL",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-04")
    },
    {
      id: "07",
      titulo: "Rutina Diaria de Cardio y Fuerza",
      descripcion: "Seguimiento y registro de actividad física en el gimnasio institucional.",
      eje: "DEPORTIVO",
      puntosTdi: 3,
      periodicidad: "UNICA",
      fechaInicio: '31-07-26',
      fechaFin: '06-09-26',
      activa: true,
      createdAt: new Date("2026-07-08")
    }
  ];

  maxPuntosEje = 1;
  generandoReporte: boolean = false;

  ngOnInit() {
    this.cargarDatos();
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

  async onGenerarReporteAlumnos(): Promise<void> {
    this.generandoReporte = true;
    try {
      await this.reporteService.generarReporteAlumnos(
        this.alumnos,
        this.resumenData?.distribucionNiveles ?? {},
        this.resumenData?.puntosPorEje ?? {} 
        //DISTRIBUCION_NIVELES_MOCK, PUNTOS_POR_EJE_MOCK
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

      const distribucionPeriodicidad = this.actividades.reduce((acc, act) => {
        acc[act.periodicidad] = (acc[act.periodicidad] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      await this.reporteService.generarReporteActividades({
        actividades: this.actividades,
        distribucionEjes,
        distribucionPeriodicidad
      });

    } finally {
      this.generandoReporte = false;
    }
  }
}
/*
const DISTRIBUCION_NIVELES_MOCK = {
  'Explorador': 4,
  'Promotor': 3,
  'Líder': 3,
  'Embajador': 2,
};

const PUNTOS_POR_EJE_MOCK = {
  PERSONAL: 1480,
  ENTORNO_SOCIAL: 1320,
  DEPORTIVO: 1178,
  TRASCENDENCIA: 1242,
};
*/

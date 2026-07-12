import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { AdminResumenDTO, AlumnoResumenDTO } from '../../core/models/admin';
import { ActividadDTO } from '../../core/models/actividad';
import { ReporteService } from '../../core/services/reporte.service';
import { REPORTE_ALUMNOS_PRESET, REPORTE_COMPLETO_PRESET, ReporteConfig } from '../../core/models/reporte-config';
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: 'app-resumen',
  imports: [FormsModule, CommonModule, CardModule, TableModule, TagModule, CheckboxModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  private adminService = inject(AdminService);
  private reporteService = inject(ReporteService);
  private cd = inject(ChangeDetectorRef);

  @ViewChild('donutRef') donutRef!: ElementRef<HTMLElement>;
  @ViewChild('barrasRef') barrasRef!: ElementRef<HTMLElement>;

  recompensas = [
    { nivel: 'Explorador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Promotor', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Líder', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Embajador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  resumenData: AdminResumenDTO | null = null;
  alumnos: AlumnoResumenDTO[] = [
    { id: '1', matricula: '20231001', nombre: 'Sofía',     apellidos: 'Ramírez Torres',  nivel: 'Embajador', cult: 320, social: 280, dep: 210, trasc: 290, total: 1100, createdAt: new Date('2026-06-20') },
  { id: '2', matricula: '20231002', nombre: 'Diego',     apellidos: 'Hernández Cruz',   nivel: 'Embajador', cult: 300, social: 260, dep: 240, trasc: 250, total: 1050, createdAt: new Date('2026-05-14') },
  { id: '3', matricula: '20231003', nombre: 'Valentina', apellidos: 'López Medina',      nivel: 'Líder',      cult: 180, social: 150, dep: 160, trasc: 140, total: 630,  createdAt: new Date('2026-07-08') },
  { id: '4', matricula: '20231004', nombre: 'Emiliano',  apellidos: 'Gómez Rivas',       nivel: 'Líder',      cult: 170, social: 160, dep: 130, trasc: 150, total: 610,  createdAt: new Date('2026-07-05') },
  { id: '5', matricula: '20231005', nombre: 'Camila',    apellidos: 'Sánchez Ortiz',     nivel: 'Líder',      cult: 160, social: 140, dep: 150, trasc: 155, total: 605,  createdAt: new Date('2026-06-28') },
  { id: '6', matricula: '20231006', nombre: 'Mateo',     apellidos: 'Fernández Solís',   nivel: 'Promotor',   cult: 90,  social: 85,  dep: 80,  trasc: 75,  total: 330,  createdAt: new Date('2026-07-09') },
  { id: '7', matricula: '20231007', nombre: 'Regina',    apellidos: 'Castillo Vega',     nivel: 'Promotor',   cult: 85,  social: 90,  dep: 70,  trasc: 65,  total: 310,  createdAt: new Date('2026-07-10') }
  ];
  actividades: ActividadDTO[] = [];
  maxPuntosEje = 1;

  generandoReporte = false;
  mostrarConfigReporte = false;

  config: ReporteConfig = {
    incluirTablaAlumnos: false,
    incluirGraficos: false,
    incluirMetricasResumen: false,
    incluirAlumnosNuevos: false,
    diasAlumnosNuevos: 7,
    incluirActividadesRecientes: false,
    diasActividadesRecientes: 7,
    incluirCambiosNivel: false,
    incluirEstadisticasNiveles: false
  };

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
    this.actividades = [];
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
}
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
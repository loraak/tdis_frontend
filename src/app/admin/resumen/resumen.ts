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

  // --- Referencias a los gráficos (para captura con html2canvas) ---
  @ViewChild('donutRef') donutRef!: ElementRef<HTMLElement>;
  @ViewChild('barrasRef') barrasRef!: ElementRef<HTMLElement>;

  recompensas = [
    { nivel: 'Sensibilizador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Formativo', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Aplicativo', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Implementador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  resumenData: AdminResumenDTO | null = null;
  alumnos: AlumnoResumenDTO[] = [];
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
      'CULTURAL': 'Cultural',
      'ENTORNO_SOCIAL': 'Entorno Social',
      'DEPORTIVO': 'Deportivo',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[key] || key;
  }

  get barEjes(): string[] {
    return ['CULTURAL', 'ENTORNO_SOCIAL', 'DEPORTIVO', 'TRASCENDENCIA'];
  }

  nivelLabel(key: string): string {
    const map: Record<string, string> = {
      'SENSIBILIZADOR': 'Sensibilizador',
      'FORMATIVO': 'Formativo',
      'APLICATIVO': 'Aplicativo',
      'IMPLEMENTADOR': 'Implementador',
    };
    return map[key] || key;
  }

  async onGenerarReporteAlumnos(): Promise<void> {
    this.generandoReporte = true;
    try {
      await this.reporteService.generarReporte(REPORTE_ALUMNOS_PRESET, this.alumnos, this.actividades);
    } finally {
      this.generandoReporte = false;
    }
  }

  async onGenerarReporteCompleto(): Promise<void> {
    if (!this.donutRef || !this.barrasRef) return;

    this.generandoReporte = true;
    try {
      await this.reporteService.generarReporte(
        REPORTE_COMPLETO_PRESET,
        this.alumnos,
        this.actividades,
        {
          totalAlumnos: this.totalAlumnos,
          aprobadas: this.actividadesAprobadas,
          rechazadas: this.actividadesRechazadas,
          puntos: this.puntosDistribuidos
        },
        { donutEl: this.donutRef.nativeElement, barrasEl: this.barrasRef.nativeElement }
      );
    } finally {
      this.generandoReporte = false;
    }
  }
}
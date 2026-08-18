import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../core/services/admin.service';
import { AdminResumenDTO, AlumnoResumenDTO } from '../../core/models/admin';
import { ActividadDTO } from '../../core/models/actividad';
import { ReporteService } from '../../core/services/reporte.service';
import { listarCuatrimestres, Periodo } from '../../core/utils/periodo.utils';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../core/services/catalogo.service';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, CardModule, TableModule, SelectModule, FormsModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit {
  private adminService = inject(AdminService);
  private catalogoService = inject(CatalogoService);
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

  tutores: { label: string; value: string | null }[] = [];
  tutorSeleccionado: string | null = null;

  alumnos: AlumnoResumenDTO[] = [];
  actividades: ActividadDTO[] = [];

  maxPuntosEje = 100;
  generandoReporte: boolean = false;

  ngOnInit() {
    this.cargarDatos();
  }

  get alumnosFiltrados(): AlumnoResumenDTO[] {
    if (!this.tutorSeleccionado) return this.alumnos;
    return this.alumnos.filter(a => a.tutor === this.tutorSeleccionado);
  }

  cargarDatos() {
    this.adminService.obtenerResumen().subscribe((data) => {
      this.resumenData = data;
      this.alumnos = data.topAlumnos;
      this.maxPuntosEje = Math.max(1, ...Object.values(data.puntosPorEje));
      this.cd.markForCheck();
    });

    this.adminService.listarTutores().subscribe((tutores) => {
      this.tutores = [
        { label: 'Todos los tutores', value: null },
        ...tutores.map(t => ({ label: t, value: t })),
      ];
      this.cd.markForCheck();
    });

    this.catalogoService.listarTodas().subscribe((acts) => {
      this.actividades = acts.filter(a => a.estadoRevision === 'APROBADA');
      this.cd.markForCheck();
    });
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
    const val = this.puntosEje(eje);
    const altura = (val / this.maxPuntosEje) * 100;
    return val > 0 ? Math.max(altura, 5) : 0;
  }

  ejeLabel(key: string): string {
    const map: Record<string, string> = {
      'PERSONAL': 'Personal',
      'ENTORNO-SOCIAL': 'Entorno Social',
      'DEPORTIVO': 'Deportivo',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[key] || key;
  }

  get barEjes(): string[] {
    return ['PERSONAL', 'ENTORNO-SOCIAL', 'DEPORTIVO', 'TRASCENDENCIA'];
  }

  nivelLabel(key: string): string {
    const map: Record<string, string> = {
      'EXPLORADOR': 'Explorador',
      'PROMOTOR': 'Promotor',
      'LIDER': 'Líder',
      'EMBAJADOR': 'Embajador',
    };
    return map[key.toUpperCase()] || key;
  }

  async onGenerarReporteAlumnos(): Promise<void> {
    this.generandoReporte = true;
    try {
      await this.reporteService.generarReporteAlumnos(
        this.alumnosFiltrados,
        this.resumenData?.distribucionNiveles ?? {},
        this.resumenData?.puntosPorEje ?? {}
      );
    } finally {
      this.generandoReporte = false;
    }
  }

  cuatrimestres: Periodo[] = listarCuatrimestres(6);
  cuatrimestreSeleccionado: Periodo = this.cuatrimestres[0];

  onGenerarReporteRiesgo(): void {
    if (!this.alumnos.length) return;
    this.reporteService.generarReporteRiesgo(this.alumnos, this.cuatrimestreSeleccionado);
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

      const distribucionAreas = this.actividades.reduce((acc, act) => {
        const area = act.area || 'Sin Área';
        acc[area] = (acc[area] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      await this.reporteService.generarReporteActividades({
        actividades: this.actividades,
        distribucionEjes,
        distribucionPeriodicidad,
        distribucionAreas
      });

    } finally {
      this.generandoReporte = false;
    }
  }
}

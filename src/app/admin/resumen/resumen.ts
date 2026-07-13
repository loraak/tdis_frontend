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
  maxPuntosEje = 1;

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
}

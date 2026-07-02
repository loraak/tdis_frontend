import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ProgresoService } from '../../../core/services/progreso.service';
import { ProgresoDTO } from '../../../core/models/progreso';

@Component({
  selector: 'app-progreso-alumno',
  imports: [CommonModule, CardModule, ProgressBarModule, TableModule, ButtonModule, TagModule, ChartModule],
  templateUrl: './progreso-alumno.html',
  styleUrl: './progreso-alumno.css',
})
export class ProgresoAlumno implements OnInit, OnChanges {
  @Input() matriculaAlumno!: string;

  private progresoService = inject(ProgresoService);

  nivelLabels: Record<string, string> = {
    SENSIBILIZADOR: 'Sensibilizador',
    FORMATIVO: 'Formativo',
    APLICATIVO: 'Aplicativo',
    IMPLEMENTADOR: 'Implementador',
  };

  tokenMatricula = '';
  nivelDesarrollo = '';
  puntosTotales = 0;
  actividades = 0;
  ptsRestantes = 0;
  porcentajeProgreso = 0;

  recompensas = [
    { nivel: 'Sensibilizador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Formativo', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Aplicativo', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Implementador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  radarData: any;
  radarOptions: any;
  dataCultural: any;
  dataSocial: any;
  dataDeportivo: any;
  dataTrascendencia: any;
  chartOptionsSmall: any;

  actividades_data: any[] = [];

  ngOnInit() {
    this.cargarDatos();
    this.initCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['matriculaAlumno'] && !changes['matriculaAlumno'].firstChange) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    if (!this.matriculaAlumno) return;

    this.progresoService.obtenerPorMatricula(this.matriculaAlumno).subscribe({
      next: (data) => this.procesarProgreso(data),
    });
  }

  private procesarProgreso(data: ProgresoDTO) {
    this.tokenMatricula = data.alumnoMatricula || this.matriculaAlumno;
    this.puntosTotales = data.puntosTotales;
    this.actividades = data.actividadesCompletadas;
    this.nivelDesarrollo = this.nivelLabels[data.nivelActual] || data.nivelActual;
    this.ptsRestantes = data.puntosSiguienteNivel || 0;
    this.porcentajeProgreso = data.porcentajeProgreso || 0;

    this.recompensas = this.recompensas.map((r) => ({
      ...r,
      isCurrent: r.nivel === this.nivelDesarrollo,
    }));

    this.actualizarChartEjes(data.puntosPorEje);
  }

  actualizarChartEjes(puntosPorEje: { [key: string]: number }) {
    const cult = puntosPorEje['CULTURAL'] || 0;
    const soc = puntosPorEje['ENTORNO_SOCIAL'] || 0;
    const dep = puntosPorEje['DEPORTIVO'] || 0;
    const tras = puntosPorEje['TRASCENDENCIA'] || 0;

    this.dataCultural = this.donutData(cult, '#0ea5e9');
    this.dataSocial = this.donutData(soc, '#22c55e');
    this.dataDeportivo = this.donutData(dep, '#f59e0b');
    this.dataTrascendencia = this.donutData(tras, '#8b5cf6');

    this.radarData = {
      labels: ['Cult.', 'Social', 'Dep.', 'Trasc.'],
      datasets: [{
        label: 'Perfil de Avance',
        data: [cult, soc, dep, tras],
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
      }]
    };
  }

  private donutData(valor: number, color: string) {
    return {
      datasets: [{
        data: [Math.min(valor, 10), Math.max(10 - valor, 0)],
        backgroundColor: [color, '#f1f5f9'],
        borderWidth: 0,
      }]
    };
  }

  initCharts() {
    this.radarData = {
      labels: ['Cult.', 'Social', 'Dep.', 'Trasc.'],
      datasets: [{
        label: 'Perfil de Avance',
        data: [0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
      }]
    };

    this.radarOptions = {
      plugins: { legend: { display: false } },
      scales: { r: { suggestMin: 0, suggestMax: 5, ticks: { display: false } } }
    };

    this.chartOptionsSmall = {
      cutout: '80%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    };

    this.dataSocial = { datasets: [{ data: [0, 10], backgroundColor: ['#22c55e', '#f1f5f9'], borderWidth: 0 }] };
    this.dataCultural = { datasets: [{ data: [0, 10], backgroundColor: ['#0ea5e9', '#f1f5f9'], borderWidth: 0 }] };
    this.dataDeportivo = { datasets: [{ data: [0, 10], backgroundColor: ['#f59e0b', '#f1f5f9'], borderWidth: 0 }] };
    this.dataTrascendencia = { datasets: [{ data: [0, 10], backgroundColor: ['#8b5cf6', '#f1f5f9'], borderWidth: 0 }] };
  }
}

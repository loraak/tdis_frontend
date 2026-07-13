import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ProgresoService } from '../../../core/services/progreso.service';
import { ProgresoDTO } from '../../../core/models/progreso';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

interface NivelDef {
  nombre: string;
  minPuntos: number;
  icon: string;
  recompensa?: string;
}
@Component({
  selector: 'app-progreso-alumno',
  imports: [CommonModule, CardModule, ProgressBarModule, TableModule, ButtonModule, TagModule, ChartModule],
  templateUrl: './progreso-alumno.html',
  styleUrl: './progreso-alumno.css',
})
export class ProgresoAlumno implements OnInit, OnChanges {
  private auth = inject(Auth);
  private progresoService = inject(ProgresoService);
  private router = inject(Router);

  nivelLabels: Record<string, string> = {
    EXPLORADOR: 'Explorador',
    PROMOTOR: 'Promotor',
    LIDER: 'Líder',
    EMBAJADOR: 'Embajador',
  };

  niveles: NivelDef[] = [
    { nombre: 'Explorador', minPuntos: 0, icon: 'fa-solid fa-leaf' },
    { nombre: 'Promotor', minPuntos: 301, icon: 'pi pi-bolt' },
    { nombre: 'Líder', minPuntos: 601, icon: 'pi pi-check-circle' },
    { nombre: 'Embajador', minPuntos: 1000, icon: 'pi pi-trophy' },
  ];

  puntosPersonal = 2;
  puntosSocial = 2;
  puntosDeportivo = 1;
  puntosTrascendencia = 0;

  get totalPuntos(): number {
    return this.puntosPersonal + this.puntosSocial + this.puntosDeportivo + this.puntosTrascendencia;
  }

  get nivelActual(): NivelDef {
    return [...this.niveles].reverse().find(n => this.totalPuntos >= n.minPuntos)!;
  }

  get nivelSiguiente(): NivelDef | null {
    const idx = this.niveles.indexOf(this.nivelActual);
    return idx < this.niveles.length - 1 ? this.niveles[idx + 1] : null;
  }

  get puntosRestantes(): number {
    return this.nivelSiguiente ? this.nivelSiguiente.minPuntos - this.totalPuntos : 0;
  }

  get progresoPorcentaje(): number {
    if (!this.nivelSiguiente) return 100;
    const rango = this.nivelSiguiente.minPuntos - this.nivelActual.minPuntos;
    const avance = this.totalPuntos - this.nivelActual.minPuntos;
    return Math.round((avance / rango) * 100);
  }

  recompensas = [
    { nivel: 'Explorador', tdis: '0', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Promotor', tdis: '<301', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Líder', tdis: '<601', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Embajador', tdis: '+1000', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  radarData: any;
  radarOptions: any;
  dataPersonal: any;
  dataSocial: any;
  dataDeportivo: any;
  dataTrascendencia: any;
  chartOptionsSmall: any;

  nivelDesarrollo = '';
  puntosTotales = 5;
  actividades = 2;

  actividades_data: any[] = [];

  ngOnInit() {
    this.initCharts();
    this.cargarProgreso();
  }

  cargarProgreso() {
    const usuario = this.auth.usuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    if (usuario.matricula) {
      this.matriculaAlumno = usuario.matricula;
      this.progresoService.obtenerPorMatricula(usuario.matricula).subscribe({
        next: (data) => this.procesarProgreso(data),
        error: () => this.router.navigate(['/login']),
      });
    } else {
      this.progresoService.obtenerPorId(usuario.usuarioId).subscribe({
        next: (data) => this.procesarProgreso(data),
        error: () => this.router.navigate(['/login']),
      });
    }
  }

  private procesarProgreso(data: ProgresoDTO) {
    this.puntosTotales = data.puntosTotales;
    this.actividades = data.actividadesCompletadas;
    this.nivelDesarrollo = this.nivelLabels[data.nivelActual] || data.nivelActual;
    this.matriculaAlumno = data.alumnoMatricula || this.matriculaAlumno;

    this.recompensas = this.recompensas.map((r) => ({
      ...r,
      isCurrent: r.nivel === this.nivelDesarrollo,
    }));

    this.actualizarChartEjes(data.puntosPorEje);
  }

  private actualizarChartEjes(puntosPorEje: { [key: string]: number }) {
    const personal = puntosPorEje['PERSONAL'] || 0;
    const soc = puntosPorEje['ENTORNO_SOCIAL'] || 0;
    const dep = puntosPorEje['DEPORTIVO'] || 0;
    const tras = puntosPorEje['TRASCENDENCIA'] || 0;

    this.dataPersonal = this.donutData(personal, '#0ea5e9');
    this.dataSocial = this.donutData(soc, '#22c55e');
    this.dataDeportivo = this.donutData(dep, '#f59e0b');
    this.dataTrascendencia = this.donutData(tras, '#8b5cf6');

    this.radarData = {
      labels: ['Personal', 'Social', 'Dep.', 'Trasc.'],
      datasets: [{
        label: 'Perfil de Avance',
        data: [personal, soc, dep, tras],
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
      labels: ['Personal', 'Social', 'Dep.', 'Trasc.'],
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
    this.dataPersonal = { datasets: [{ data: [0, 10], backgroundColor: ['#0ea5e9', '#f1f5f9'], borderWidth: 0 }] };
    this.dataDeportivo = { datasets: [{ data: [0, 10], backgroundColor: ['#f59e0b', '#f1f5f9'], borderWidth: 0 }] };
    this.dataTrascendencia = { datasets: [{ data: [0, 10], backgroundColor: ['#8b5cf6', '#f1f5f9'], borderWidth: 0 }] };
  }

  @Input() matriculaAlumno!: string;

  rolUsuario = computed(() => this.auth.rol() || '');

  esAdmin = computed(() => this.rolUsuario() === 'ADMINISTRADOR');

  @Input() nombreAlumno = '';

  @Output() aprobarActividad = new EventEmitter<any>();
  @Output() rechazarActividad = new EventEmitter<any>();
  @Output() verEvidencia = new EventEmitter<any>();

  get actividadesPendientes(): number {
    return this.actividades_data.filter(a => a.estado === 'PENDIENTE').length;
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

  onAprobar(act: any) {
    this.aprobarActividad.emit(act);
  }

  onRechazar(act: any) {
    this.rechazarActividad.emit(act);
  }

  onVerEvidencia(act: any) {
    this.verEvidencia.emit(act);
  }
}
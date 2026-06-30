import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart'; 

@Component({
  selector: 'app-progreso-alumno',
  imports: [CommonModule, CardModule, ProgressBarModule, TableModule, ButtonModule, TagModule, ChartModule],
  templateUrl: './progreso-alumno.html',
  styleUrl: './progreso-alumno.css',
})
export class ProgresoAlumno implements OnInit, OnChanges {
  @Input() matriculaAlumno!: string; 

  ngOnInit() {
    this.cargarDatos();
    this.initCharts();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Si el administrador cambia de alumno en la tabla, recargamos los datos
    if (changes['matriculaAlumno'] && !changes['matriculaAlumno'].firstChange) {
      this.cargarDatos();
    }
  }

  cargarDatos() {
    // Aquí haces la petición a tu API/Servicio usando la this.matriculaAlumno
    console.log('Cargando el gran progreso para:', this.matriculaAlumno);
  }

  tokenMatricula = '2026191005';
  nivelDesarrollo = 'Sensibilizador';
  puntosTotales = 5;
  actividades = 2;
  ptsRestantes = 45;
  porcentajeProgreso = 10;

  recompensas = [
    { nivel: 'Sensibilizador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Formativo', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Aplicativo', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Implementador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  radarData: any;
  radarOptions: any;
  
  // Datos para los circulos pequeños
  dataCultural: any;
  dataSocial: any;
  dataDeportivo: any;
  dataTrascendencia: any;
  chartOptionsSmall: any;

  actividades_data = [
    { fecha: '13/03/2026 12:37', nombre: 'Ponte en su lugar: Museo de las heridas no visibles', p_cult: 0, p_soc: 1, p_dep: 0, p_tras: 0 },
    { fecha: '13/03/2026 13:24', nombre: 'Defensa Urbana Femenina', p_cult: 0, p_soc: 4, p_dep: 0, p_tras: 0 }
  ];

  initCharts() {
    // Configuración Radar
    this.radarData = {
      labels: ['Cult.', 'Social', 'Dep.', 'Trasc.'],
      datasets: [{
        label: 'Perfil de Avance',
        data: [2, 5, 1, 1],
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

    // Ejemplo de un eje con puntos (Social = 5 puntos de 10)
    this.dataSocial = {
      datasets: [{
        data: [5, 5],
        backgroundColor: ['#22c55e', '#f1f5f9'],
        borderWidth: 0
      }]
    };

    // Ejes vacíos
    const emptyData = (color: string) => ({
      datasets: [{ data: [0, 10], backgroundColor: [color, '#f1f5f9'], borderWidth: 0 }]
    });

    this.dataCultural = emptyData('#0ea5e9');
    this.dataDeportivo = emptyData('#f59e0b');
    this.dataTrascendencia = emptyData('#8b5cf6');
  }
}

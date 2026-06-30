import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-resumen',
  imports: [CardModule, TableModule, TagModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen {
  recompensas = [
    { nivel: 'Sensibilizador', tdis: '20', recompensa: 'Reconocimiento oficial', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', isCurrent: true },
    { nivel: 'Formativo', tdis: '50', recompensa: 'Playera UTEQ + Reconocimiento', icon: 'pi pi-bolt', iconColor: 'var(--tdis-color-light-blue)', isCurrent: false },
    { nivel: 'Aplicativo', tdis: '90', recompensa: 'Termo + Playera + Libreta + Reconocimiento Público', icon: 'pi pi-check-circle', iconColor: 'var(--tdis-color-navy-blue)', isCurrent: false },
    { nivel: 'Implementador', tdis: '+160', recompensa: 'Chamarra UTEQ + Playera + Libreta + Certificado/Diploma curricular', icon: 'pi pi-trophy', iconColor: 'var(--tdis-color-yellow)', isCurrent: false }
  ];

  alumnos = [
    { id: 1, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
    { id: 2, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
    { id: 3, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ProgresoAlumno } from '../../shared/components/progreso-alumno/progreso-alumno';

@Component({
  selector: 'app-alumnos',
  imports: [CommonModule, CardModule, DialogModule, TableModule, ProgresoAlumno],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css',
})
export class Alumnos {
  alumnos = [
    { id: 1, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
    { id: 2, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
    { id: 3, matricula: '2024396177', nivel: 'Sensibilizador', icon: 'fa-solid fa-leaf', iconColor: 'var(--tdis-color-light-green)', cult: 1, social: 5, dep: 0, trasc: 0, total: 6 },
  ];

  mostrarModal: boolean = false;
  
  alumnoSeleccionado: any = null;

  verProgresoAlumno(alumno: any): void {
    this.alumnoSeleccionado = alumno;
    this.mostrarModal = true;
  }
}

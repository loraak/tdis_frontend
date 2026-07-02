import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ProgresoAlumno } from '../../shared/components/progreso-alumno/progreso-alumno';
import { AdminService } from '../../core/services/admin.service';
import { AlumnoResumenDTO } from '../../core/models/admin';

@Component({
  selector: 'app-alumnos',
  imports: [CommonModule, CardModule, DialogModule, TableModule, ProgresoAlumno],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css',
})
export class Alumnos implements OnInit {
  private adminService = inject(AdminService);
  private cd = inject(ChangeDetectorRef);

  alumnos: AlumnoResumenDTO[] = [];

  mostrarModal: boolean = false;
  alumnoSeleccionado: AlumnoResumenDTO | null = null;

  ngOnInit() {
    this.adminService.listarAlumnos().subscribe((data) => {
      this.alumnos = data;
      this.cd.markForCheck();
    });
  }

  verProgresoAlumno(alumno: AlumnoResumenDTO): void {
    this.alumnoSeleccionado = alumno;
    this.mostrarModal = true;
  }
}

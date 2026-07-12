import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-actividad',
  imports: [CommonModule, FormsModule, InputTextModule, CardModule],
  templateUrl: './actividad.html',
  styleUrl: './actividad.css',
})
export class Actividad {
  tipoFormulario: string = 'EVIDENCIA';
  loading = false;
  success = false;
  error = '';

  private auth = inject(Auth);
  private catalogoService = inject(CatalogoService);
  private solicitudesService = inject(SolicitudesService);
  private router = inject(Router);

  actividades: ActividadDTO[] = [];
  actividadSeleccionada: ActividadDTO | null = null;
  mostrarSelector = true;

  division = '';
  grupo = '';
  cuatrimestre = '';
  turno = '';
  tutor = '';

  nombreActividad = '';
  tipoActividad: string = 'EXTERNA';
  descripcion = '';
  reflexion = '';

  nombreResponsable = '';
  correoResponsable = '';
  nombreSolicitante: any;
  area: any;
  organizacionResponsable: any;
  origenActividad: any;
  fechaPeriodo: any;
  periodicidad: any;
  ejeSeleccionado: any;
  nivel: any;
  telefono: any;
  otrosCorreos: any;
  tiempoEstimado: any;
  asistenciaEsperada: any;
  minParticipacion: any;
  fechaInicio: any;
  fechaFin: any;

  ngOnInit() {
    const user = this.auth.usuario();
    if (user) {
    }
    this.catalogoService.listarActivas().subscribe(data => this.actividades = data);
  }

  get actividadesFiltradas(): ActividadDTO[] {
    return this.actividades;
  }

  volverAlSelector() {
    this.actividadSeleccionada = null;
    this.nombreActividad = '';
    this.mostrarSelector = false;
    this.success = true;
    this.error = '';
  }

  irAMisSolicitudes() {
    this.router.navigate(['/alumno/solicitudes']);
  }
  
  cambiarTipoActividad(tipo: string): void {
    this.tipoActividad = tipo;
  }

  seleccionarDivision(val: string) { this.division = val; }
  seleccionarTurno(val: string) { this.turno = val; }

  onSubmit() {
    if (!this.actividadSeleccionada) return;
    this.loading = true;
    this.error = '';

    this.solicitudesService.crear({
      actividadId: this.actividadSeleccionada.id,
      tipoSolicitud: this.tipoFormulario,
      descripcion: this.descripcion || undefined,
      reflexion: this.reflexion || undefined,
      tipoActividad: this.tipoActividad || undefined,
      division: this.division || undefined,
      grupo: this.grupo || undefined,
      cuatrimestre: this.cuatrimestre || undefined,
      turno: this.turno || undefined,
      tutor: this.tutor || undefined,
      nombreResponsable: this.nombreResponsable || undefined,
      correoResponsable: this.correoResponsable || undefined,
    }).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al enviar solicitud';
        this.loading = false;
      },
    });
  }
}

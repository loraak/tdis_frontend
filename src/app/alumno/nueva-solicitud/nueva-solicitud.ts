import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-nueva-solicitud',
  imports: [CommonModule, FormsModule, InputTextModule, CardModule],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud implements OnInit {
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

  nombre = '';
  matricula = '';
  division = '';
  programa = '';
  grupo = '';
  cuatrimestre = '';
  turno = '';
  tutor = '';

  nombreActividad = '';
  fecha = '';
  horas = '';
  lugar = '';
  tipoActividad = '';
  materiaRelacionada = '';
  descripcion = '';
  reflexion = '';

  nombreResponsable = '';
  cargoResponsable = '';
  telefonoResponsable = '';
  correoResponsable = '';

  ngOnInit() {
    const user = this.auth.usuario();
    if (user) {
      this.nombre = `${user.nombre} ${user.apellidos || ''}`;
      this.matricula = user.matricula || '';
    }
    this.catalogoService.listarActivas().subscribe(data => this.actividades = data);
  }

  get actividadesFiltradas(): ActividadDTO[] {
    return this.actividades;
  }

  ejeLabel(eje: string): string {
    const map: Record<string, string> = {
      'ENTORNO_SOCIAL': 'Entorno Social',
      'PERSONAL': 'Personal',
      'DEPORTIVO': 'Deportivo',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[eje] || eje;
  }

  seleccionarActividad(act: ActividadDTO) {
    this.actividadSeleccionada = act;
    this.nombreActividad = act.titulo;
    this.mostrarSelector = false;
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

  cambiarTipo(tipo: string): void {
    this.tipoFormulario = tipo;
  }

  seleccionarDivision(val: string) { this.division = val; }
  seleccionarTurno(val: string) { this.turno = val; }
  seleccionarLugar(val: string) { this.lugar = val; }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList = element.files;
    if (fileList && fileList.length > 0) {
      console.log('Archivo seleccionado:', fileList[0].name, 'Tamaño:', fileList[0].size);
    }
  }

  onSubmit() {
    if (!this.actividadSeleccionada) return;
    this.loading = true;
    this.error = '';

    this.solicitudesService.crear({
      actividadId: this.actividadSeleccionada.id,
      tipoSolicitud: this.tipoFormulario,
      descripcion: this.descripcion || undefined,
      reflexion: this.reflexion || undefined,
      lugar: this.lugar || undefined,
      horas: this.horas || undefined,
      tipoActividad: this.tipoActividad || undefined,
      materiaRelacionada: this.materiaRelacionada || undefined,
      division: this.division || undefined,
      programa: this.programa || undefined,
      grupo: this.grupo || undefined,
      cuatrimestre: this.cuatrimestre || undefined,
      turno: this.turno || undefined,
      tutor: this.tutor || undefined,
      nombreResponsable: this.nombreResponsable || undefined,
      cargoResponsable: this.cargoResponsable || undefined,
      telefonoResponsable: this.telefonoResponsable || undefined,
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

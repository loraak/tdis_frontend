import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { CatalogoService } from '../../core/services/catalogo.service';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { DocumentosService } from '../../core/services/documentos.service';
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
  private documentosService = inject(DocumentosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

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
  datosPrecargados = false;

  nombreActividad = '';
  fecha = '';
  horas = '';
  lugar = '';
  tipoActividad = '';
  materiaRelacionada = '';
  descripcion = '';
  reflexion = '';
  actividadPrecargada = false;

  nombreResponsable = '';
  cargoResponsable = '';
  telefonoResponsable = '';
  correoResponsable = '';

  archivoSeleccionado: File | null = null;

  actividadIdPendiente: string | null = null;

  ngOnInit() {
    const user = this.auth.usuario();
    if (user) {
      this.nombre = `${user.nombre} ${user.apellidos || ''}`;
      this.matricula = user.matricula || '';
    }

    const profile = this.auth.getStudentProfile();
    if (profile) {
      this.datosPrecargados = true;
      this.division = profile.division || '';
      this.programa = profile.programa || '';
      this.grupo = profile.grupo || '';
      this.cuatrimestre = profile.cuatrimestre || '';
      this.turno = profile.turno || '';
      this.tutor = profile.tutor || '';
    }

    combineLatest([
      this.catalogoService.listarActivas(),
      this.route.queryParamMap,
    ]).subscribe(([actividades, params]) => {
      this.actividades = actividades;

      const nuevaId = params.get('actividadId');
      if (nuevaId && nuevaId !== this.actividadIdPendiente) {
        this.actividadIdPendiente = nuevaId;
        this.actividadSeleccionada = null;
      }

      if (this.actividadIdPendiente && !this.actividadSeleccionada) {
        const act = this.actividades.find(a => a.id === this.actividadIdPendiente);
        if (act) this.seleccionarActividad(act);
      }

      this.cdr.detectChanges();
    });
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
    this.mostrarSelector = false;
    this.actividadPrecargada = true;
    this.tipoFormulario = 'EVIDENCIA';
    this.nombreActividad = act.titulo;
    this.descripcion = act.descripcion || '';
    if (act.periodicidad === 'UNICA' && act.fechaInicio) {
      this.fecha = act.fechaInicio;
    } else {
      this.fecha = '';
    }
  }

  limpiarActividad() {
    this.actividadSeleccionada = null;
    this.actividadPrecargada = false;
    this.nombreActividad = '';
    this.descripcion = '';
    this.fecha = '';
  }

  volverAlSelector() {
    this.actividadSeleccionada = null;
    this.nombreActividad = '';
    this.mostrarSelector = false;
    this.success = true;
    this.error = '';
  }

  irAMisSolicitudes() {
    this.router.navigate(['/alumno/mis-solicitudes']);
  }

  cambiarTipo(tipo: string): void {
    this.tipoFormulario = tipo;

    if (tipo === 'PREVIA') {
      this.nombreActividad = '';
      this.descripcion = '';
    } else if (tipo === 'EVIDENCIA' && this.actividadSeleccionada) {
      this.nombreActividad = this.actividadSeleccionada.titulo;
      this.descripcion = this.actividadSeleccionada.descripcion || '';
    }
  }

  seleccionarDivision(val: string) { this.division = val; }
  seleccionarTurno(val: string) { this.turno = val; }
  seleccionarLugar(val: string) { this.lugar = val; }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList = element.files;
    if (fileList && fileList.length > 0) {
      this.archivoSeleccionado = fileList[0];
      console.log('Archivo seleccionado:', fileList[0].name, 'Tamano:', fileList[0].size);
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
    }).pipe(
      switchMap(solicitud => {
        if (this.archivoSeleccionado) {
          return this.documentosService.subirArchivo(solicitud.id, this.archivoSeleccionado)
            .pipe(switchMap(() => this.solicitudesService.analizarIA(solicitud.id)));
        }
        return [solicitud];
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/alumno/mis-solicitudes']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al enviar solicitud';
        this.loading = false;
      },
    });
  }
}

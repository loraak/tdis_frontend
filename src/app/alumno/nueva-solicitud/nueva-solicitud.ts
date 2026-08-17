import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, of, catchError } from 'rxjs';
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

  camposInvalidos: Set<string> = new Set();

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

  // Selecciones múltiples para Solicitud Previa
  dimensiones: string[] = [];
  nivelImpacto: string = '';
  publicoObjetivo: string[] = [];
  asignaturasRelacionadas: string[] = [];
  competenciasReforzar: string[] = [];
  evidenciasRequeridas: string[] = [];
  justificacionPersonal = '';
  impactoAcademico = '';
  asistenciaEsperada = '';
  alumnosGeneranTdi = '';
  horasEfectivas: number | null = null;
  periodicidad = '';
  fechaInicio = '';
  fechaFin = '';
  
  // Campos de Actividad para PREVIA
  eje: string = '';

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
    this.periodicidad = act.periodicidad || '';
    this.fechaInicio = act.fechaInicio || '';
    this.fechaFin = act.fechaFin || '';
    this.horas = act.horasEfectivas ? String(act.horasEfectivas) : '';
    
    // Precargar y bloquear: Lugar
    if (act.lugar === 'INTERNO') {
      this.lugar = 'Interno (UTEQ)';
    } else if (act.lugar === 'EXTERNO') {
      this.lugar = 'Externo';
    }
    
    // Precargar y bloquear: Materia relacionada (join de asignaturas)
    if (act.asignaturasRelacionadas && act.asignaturasRelacionadas.length > 0) {
      this.materiaRelacionada = act.asignaturasRelacionadas.join(', ');
    }
  }

  limpiarActividad() {
    this.actividadSeleccionada = null;
    this.actividadPrecargada = false;
    this.nombreActividad = '';
    this.descripcion = '';
    this.periodicidad = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.lugar = '';
    this.horasEfectivas = null;
    this.materiaRelacionada = '';
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
      // En PREVIA no se precargan datos, es para crear actividad nueva
      this.nombreActividad = '';
      this.descripcion = '';
      this.actividadPrecargada = false;
      this.lugar = '';
      this.horasEfectivas = null;
      this.materiaRelacionada = '';
      this.periodicidad = '';
      this.fechaInicio = '';
      this.fechaFin = '';
      this.eje = '';
    } else if (tipo === 'EVIDENCIA' && this.actividadSeleccionada) {
      this.nombreActividad = this.actividadSeleccionada.titulo;
      this.descripcion = this.actividadSeleccionada.descripcion || '';
      this.periodicidad = this.actividadSeleccionada.periodicidad || '';
      this.fechaInicio = this.actividadSeleccionada.fechaInicio || '';
      this.fechaFin = this.actividadSeleccionada.fechaFin || '';
      this.horasEfectivas = this.actividadSeleccionada.horasEfectivas ?? null;
      
      // Precargar y bloquear: Lugar
      if (this.actividadSeleccionada.lugar === 'INTERNO') {
        this.lugar = 'Interno (UTEQ)';
      } else if (this.actividadSeleccionada.lugar === 'EXTERNO') {
        this.lugar = 'Externo';
      }
      
      // Precargar y bloquear: Materia relacionada
      if (this.actividadSeleccionada.asignaturasRelacionadas && this.actividadSeleccionada.asignaturasRelacionadas.length > 0) {
        this.materiaRelacionada = this.actividadSeleccionada.asignaturasRelacionadas.join(', ');
      }
      this.actividadPrecargada = true;
    }
  }

  seleccionarDivision(val: string) { this.division = val; this.camposInvalidos.delete('division'); }
  seleccionarTurno(val: string) { this.turno = val; this.camposInvalidos.delete('turno'); }
  seleccionarLugar(val: string) { if (!this.actividadPrecargada) { this.lugar = val; this.camposInvalidos.delete('lugar'); } }

  onInputChange(campo: string) { this.camposInvalidos.delete(campo); this.error = ''; }
  isInvalid(campo: string): boolean { return this.camposInvalidos.has(campo); }

  toggleMulti(lista: string[], valor: string): string[] {
    return lista.includes(valor) ? lista.filter(v => v !== valor) : [...lista, valor];
  }

  toggleDimension(val: string) { this.dimensiones = this.toggleMulti(this.dimensiones, val); }
  togglePublico(val: string) { this.publicoObjetivo = this.toggleMulti(this.publicoObjetivo, val); }
  toggleAsignatura(val: string) { this.asignaturasRelacionadas = this.toggleMulti(this.asignaturasRelacionadas, val); }
  toggleCompetencia(val: string) { this.competenciasReforzar = this.toggleMulti(this.competenciasReforzar, val); }
  toggleEvidencia(val: string) { this.evidenciasRequeridas = this.toggleMulti(this.evidenciasRequeridas, val); }

  seleccionarNivelImpacto(val: string) { this.nivelImpacto = val; }

  validarMinCaracteres(texto: string, min: number): boolean {
    return (texto || '').trim().length >= min;
  }

  get descripcionValida(): boolean {
    return this.validarMinCaracteres(this.descripcion, 20);
  }

  get justificacionValida(): boolean {
    return this.validarMinCaracteres(this.justificacionPersonal, 20);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList = element.files;
    if (fileList && fileList.length > 0) {
      this.archivoSeleccionado = fileList[0];
      console.log('Archivo seleccionado:', fileList[0].name, 'Tamano:', fileList[0].size);
    }
  }

  validarCampos(): { errores: string[], camposInvalidos: string[] } {
    const errores: string[] = [];
    const camposInvalidos: string[] = [];

    if (!this.nombre || !this.nombre.trim()) { errores.push('El nombre es requerido'); camposInvalidos.push('nombre'); }
    if (!this.matricula || !this.matricula.trim()) { errores.push('La matrícula es requerida'); camposInvalidos.push('matricula'); }
    if (!this.division) { errores.push('La división es requerida'); camposInvalidos.push('division'); }
    if (!this.programa || !this.programa.trim()) { errores.push('El programa académico es requerido'); camposInvalidos.push('programa'); }
    if (!this.grupo || !this.grupo.trim()) { errores.push('El grupo es requerido'); camposInvalidos.push('grupo'); }
    if (!this.cuatrimestre || !this.cuatrimestre.trim()) { errores.push('El cuatrimestre es requerido'); camposInvalidos.push('cuatrimestre'); }
    if (!this.turno) { errores.push('El turno es requerido'); camposInvalidos.push('turno'); }

    if (!this.nombreActividad || !this.nombreActividad.trim()) { errores.push('El nombre de la actividad es requerido'); camposInvalidos.push('nombreActividad'); }
    if (this.tipoFormulario === 'PREVIA') {
      if (!this.periodicidad) { errores.push('La periodicidad es requerida'); camposInvalidos.push('periodicidad'); }
      if (!this.fechaInicio || !this.fechaInicio.trim()) { errores.push('La fecha de inicio es requerida'); camposInvalidos.push('fechaInicio'); }
      if (!this.lugar) { 
        errores.push('El lugar es requerido'); 
        camposInvalidos.push('lugar'); 
      }
      if (!this.horasEfectivas || this.horasEfectivas < 1) { 
        errores.push('Las horas efectivas son requeridas'); 
        camposInvalidos.push('horasEfectivas'); 
      }
    }

    if (this.tipoFormulario === 'EVIDENCIA') {
      if (!this.tutor || !this.tutor.trim()) { errores.push('El tutor es requerido'); camposInvalidos.push('tutor'); }
      if (!this.tipoActividad || !this.tipoActividad.trim()) { errores.push('El tipo de actividad es requerido'); camposInvalidos.push('tipoActividad'); }
      if (!this.actividadPrecargada && (!this.materiaRelacionada || !this.materiaRelacionada.trim())) { 
        errores.push('La materia relacionada es requerida'); 
        camposInvalidos.push('materiaRelacionada'); 
      }
      if (!this.descripcion || this.descripcion.trim().length < 20) { errores.push('La descripción debe tener al menos 20 caracteres'); camposInvalidos.push('descripcion'); }
      if (!this.reflexion || this.reflexion.trim().length < 5) { errores.push('La reflexión es requerida (mínimo 5 palabras)'); camposInvalidos.push('reflexion'); }
      if (!this.archivoSeleccionado) { errores.push('Debes adjuntar una evidencia de imagen'); camposInvalidos.push('archivoSeleccionado'); }
    }

    if (this.tipoFormulario === 'PREVIA') {
      if (!this.tutor || !this.tutor.trim()) { errores.push('El tutor es requerido'); camposInvalidos.push('tutor'); }
      if (!this.descripcion || this.descripcion.trim().length < 20) { errores.push('La descripción detallada debe tener al menos 20 caracteres'); camposInvalidos.push('descripcion'); }
      if (this.dimensiones.length === 0) { errores.push('Selecciona al menos una dimensión de formación integral'); camposInvalidos.push('dimensiones'); }
      if (!this.nivelImpacto) { errores.push('Selecciona el nivel de impacto'); camposInvalidos.push('nivelImpacto'); }
      if (this.publicoObjetivo.length === 0) { errores.push('Selecciona al menos un público objetivo'); camposInvalidos.push('publicoObjetivo'); }
      if (!this.asistenciaEsperada || !this.asistenciaEsperada.trim()) { errores.push('La asistencia esperada es requerida'); camposInvalidos.push('asistenciaEsperada'); }
      if (!this.alumnosGeneranTdi || !this.alumnosGeneranTdi.trim()) { errores.push('El número de alumnos que generarán TDI\'s es requerido'); camposInvalidos.push('alumnosGeneranTdi'); }
      if (this.asignaturasRelacionadas.length === 0) { errores.push('Selecciona al menos una asignatura relacionada'); camposInvalidos.push('asignaturasRelacionadas'); }
      if (this.competenciasReforzar.length === 0) { errores.push('Selecciona al menos una competencia a reforzar'); camposInvalidos.push('competenciasReforzar'); }
      if (!this.impactoAcademico || this.impactoAcademico.trim().length < 10) { errores.push('El impacto académico es requerido (mínimo 10 caracteres)'); camposInvalidos.push('impactoAcademico'); }
      if (!this.justificacionPersonal || this.justificacionPersonal.trim().length < 20) { errores.push('La justificación personal debe tener al menos 20 caracteres'); camposInvalidos.push('justificacionPersonal'); }
      if (this.evidenciasRequeridas.length === 0) { errores.push('Selecciona al menos un tipo de evidencia requerida'); camposInvalidos.push('evidenciasRequeridas'); }
      // Campos de Actividad requeridos para PREVIA
      if (!this.eje) { errores.push('Selecciona el eje formativo'); camposInvalidos.push('eje'); }
      if (!this.lugar) { errores.push('Selecciona el lugar (Interno/Externo)'); camposInvalidos.push('lugar'); }
      if (!this.horasEfectivas || this.horasEfectivas < 1) { errores.push('Ingresa las horas efectivas (mínimo 1)'); camposInvalidos.push('horasEfectivas'); }
    }

    return { errores, camposInvalidos };
  }

onSubmit() {
    const { errores, camposInvalidos } = this.validarCampos();
    if (errores.length > 0) {
      this.error = errores.join('\n');
      this.camposInvalidos = new Set(camposInvalidos);
      
      // Scroll to first invalid field
      const primerCampo = camposInvalidos[0];
      if (primerCampo) {
        setTimeout(() => {
          const elemento = document.querySelector(`[name="${primerCampo}"]`) 
            || document.querySelector(`#${primerCampo}`)
            || document.querySelector(`[ngModel]="${primerCampo}"`);
          if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (elemento as HTMLElement).focus?.();
          }
        }, 0);
      }
      
      this.cdr.detectChanges();
      return;
    }

    if (!this.actividadSeleccionada && this.tipoFormulario === 'EVIDENCIA') {
      this.error = 'Selecciona una actividad del catálogo';
      return;
    }

    this.loading = true;
    this.error = '';

    const actividadId = this.tipoFormulario === 'EVIDENCIA'
      ? this.actividadSeleccionada!.id
      : (this.actividadSeleccionada?.id || undefined);

    this.solicitudesService.crear({
      actividadId,
      nombreActividad: this.tipoFormulario === 'PREVIA' ? this.nombreActividad : undefined,
      tipoSolicitud: this.tipoFormulario,
      descripcion: this.descripcion || undefined,
      reflexion: this.reflexion || undefined,
      lugar: this.lugar || undefined,
      horas: this.horasEfectivas ? String(this.horasEfectivas) : undefined,
      periodicidad: this.periodicidad || undefined,
      fechaInicio: this.fechaInicio || undefined,
      fechaFin: this.fechaFin || undefined,
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
      // Campos de Solicitud Previa
      dimensionesFormacion: this.dimensiones.length > 0 ? this.dimensiones.join(', ') : undefined,
      nivelImpacto: this.nivelImpacto || undefined,
      publicoObjetivo: this.publicoObjetivo.length > 0 ? this.publicoObjetivo.join(', ') : undefined,
      asignaturasRelacionadas: this.asignaturasRelacionadas.length > 0 ? this.asignaturasRelacionadas.join(', ') : undefined,
      competenciasReforzar: this.competenciasReforzar.length > 0 ? this.competenciasReforzar.join(', ') : undefined,
      evidenciasRequeridas: this.evidenciasRequeridas.length > 0 ? this.evidenciasRequeridas.join(', ') : undefined,
      justificacionPersonal: this.justificacionPersonal || undefined,
      impactoAcademico: this.impactoAcademico || undefined,
      asistenciaEsperada: this.asistenciaEsperada || undefined,
      alumnosGeneranTdi: this.alumnosGeneranTdi || undefined,
      horasEfectivas: this.horasEfectivas ?? undefined,
      // Campos de Actividad para PREVIA
      eje: this.tipoFormulario === 'PREVIA' ? (this.eje as 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA') : undefined,
      tipoLugar: this.tipoFormulario === 'PREVIA' ? (this.lugar === 'Externo' ? 'EXTERNO' : 'INTERNO') : undefined,
    }).pipe(
      switchMap(solicitud => {
        console.log('✅ Solicitud creada:', solicitud.id);
        // Evidencia: subir archivo y analizar con webhook de IA
        // Solicitud Previa: solo crear la solicitud, sin evidencia
        if (this.tipoFormulario === 'EVIDENCIA' && this.archivoSeleccionado) {
          return this.documentosService.subirArchivo(solicitud.id, this.archivoSeleccionado)
            .pipe(
              switchMap((response: { nombreAlmacenado: string; nombreOriginal: string }) => {
                console.log('✅ Archivo subido:', response);
                const nombreOriginal = response.nombreOriginal;
                return this.solicitudesService.actualizarNombreArchivo(solicitud.id, nombreOriginal)
                  .pipe(
                    switchMap((updatedSolicitud) => {
                      console.log('✅ Nombre archivo actualizado:', updatedSolicitud.nombreArchivo);
                      return this.solicitudesService.analizarIA(solicitud.id);
                    })
                  );
              }),
              catchError(err => {
                console.error('❌ Error en upload/actualizar/analizar:', err);
                throw err;
              })
            );
        }
        return of(solicitud);
      }),
      catchError(err => {
        console.error('❌ Error en crear solicitud:', err);
        throw err;
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/alumno/mis-solicitudes']);
      },
      error: (err) => {
        console.error('❌ Error final:', err);
        this.error = err.error?.message || 'Error al enviar solicitud';
        this.loading = false;
      },
    });
  }
}

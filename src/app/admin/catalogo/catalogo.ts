import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { CatalogoService } from '../../core/services/catalogo.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-admin-catalogo',
  imports: [CommonModule, FormsModule, CardModule, TagModule, DialogModule, CheckboxModule, MultiSelectModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class AdminCatalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  actividades: ActividadDTO[] = [];
  loading = true;
  filtroEstado = 'TODAS';

  mostrarFormulario = false;
  editandoId: string | null = null;
  guardando = false;

  form: FormActividad = this.formVacio();

  EJES = ['ENTORNO_SOCIAL', 'PERSONAL', 'DEPORTIVO', 'TRASCENDENCIA'];
  PERIODICIDADES = ['UNICA', 'SEMANAL', 'MENSUAL', 'CUATRIMESTRAL', 'ANUAL'];

  DIMENSIONES = [
    { label: 'Identidad personal (Aprender a conocer)', value: 'IDENTIDAD_PERSONAL' },
    { label: 'Entorno social (Aprender a convivir)', value: 'ENTORNO_SOCIAL' },
    { label: 'Entorno físico (Aprender a Hacer)', value: 'ENTORNO_FISICO' },
    { label: 'Trascendencia (Aprender a Ser)', value: 'TRASCENDENCIA' },
  ];

  NIVELES_IMPACTO = [
    { label: 'Sensibilizador (solo escucha)', value: 'SENSIBILIZADOR' },
    { label: 'Formativo (intercambio de ideas)', value: 'FORMATIVO' },
    { label: 'Aplicación (participación activa)', value: 'APLICACION' },
    { label: 'Implementador (dirige)', value: 'IMPLEMENTADOR' },
  ];

  PUBLICOS_OBJETIVO = [
    { label: 'Solo alumnas', value: 'SOLO_ALUMNAS' },
    { label: 'Solo alumnos', value: 'SOLO_ALUMNOS' },
    { label: 'Solo División Industrial', value: 'SOLO_DIVISION_INDUSTRIAL' },
    { label: 'Solo División Económica-Administrativa', value: 'SOLO_DIVISION_ECONOMICO_ADMINISTRATIVA' },
    { label: 'Solo División Tecnologías', value: 'SOLO_DIVISION_TECNOLOGIAS' },
    { label: 'Solo División Idiomas', value: 'SOLO_DIVISION_IDIOMAS' },
    { label: 'Todas las divisiones', value: 'TODAS_LAS_DIVISIONES' },
  ];

  ASIGNATURAS = [
    { label: '1ro Desarrollo Humano y Valores', value: 'DESARROLLO_HUMANO_Y_VALORES' },
    { label: '2do Habilidades Socioemocionales', value: 'HABILIDADES_SOCIOEMOCIONALES' },
    { label: '3ra Desarrollo del Pensamiento Crítico', value: 'DESARROLLO_DEL_PENSAMIENTO_CRITICO' },
    { label: '4to Ética y Valores', value: 'ETICA_Y_VALORES' },
    { label: '5to Liderazgo de Equipos de Alto Desempeño', value: 'LIDERAZGO_DE_EQUIPOS_DE_ALTO_DESEMPENO' },
    { label: '7mo Habilidades Gerenciales', value: 'HABILIDADES_GERENCIALES' },
  ];

  COMPETENCIAS = [
    { label: 'Comunicación efectiva', value: 'COMUNICACION_EFECTIVA' },
    { label: 'Trabajo en equipo', value: 'TRABAJO_EN_EQUIPO' },
    { label: 'Liderazgo', value: 'LIDERAZGO' },
    { label: 'Pensamiento crítico', value: 'PENSAMIENTO_CRITICO' },
    { label: 'Responsabilidad y ética', value: 'RESPONSABILIDAD_Y_ETICA' },
    { label: 'Toma de decisiones', value: 'TOMA_DE_DECISIONES' },
    { label: 'Autogestión y disciplina', value: 'AUTOGESTION_Y_DISCIPLINA' },
    { label: 'Participación social', value: 'PARTICIPACION_SOCIAL' },
    { label: 'Otro', value: 'OTRO' },
  ];

  TIPOS_EVIDENCIA = [
    { label: 'Lista de Asistencia firmada por el responsable', value: 'LISTA_ASISTENCIA_FIRMADA' },
    { label: 'Fotografía', value: 'FOTOGRAFIA' },
    { label: 'Constancia / documento', value: 'CONSTANCIA_DOCUMENTO' },
    { label: 'Producto o reporte elaborado', value: 'PRODUCTO_REPORTE_ELABORADO' },
    { label: 'Otro', value: 'OTRO' },
  ];

  TIPOS_LUGAR = [
    { label: 'Interno (UTEQ)', value: 'INTERNO' },
    { label: 'Externo', value: 'EXTERNO' },
  ];

  ngOnInit() {
    this.cargarActividades();
  }

  cargarActividades() {
    this.loading = true;
    this.catalogoService.listarTodas().subscribe({
      next: (data) => {
        this.actividades = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get actividadesFiltradas(): ActividadDTO[] {
    if (this.filtroEstado === 'TODAS') return this.actividades;
    if (this.filtroEstado === 'ACTIVAS') return this.actividades.filter(a => a.activa);
    if (this.filtroEstado === 'INACTIVAS') return this.actividades.filter(a => !a.activa);
    return this.actividades;
  }

  get totalActivas(): number { return this.actividades.filter(a => a.activa).length; }
  get totalInactivas(): number { return this.actividades.filter(a => !a.activa).length; }

  abrirCrear() {
    this.editandoId = null;
    this.form = this.formVacio();
    this.mostrarFormulario = true;
  }

  abrirEditar(actividad: ActividadDTO) {
    this.editandoId = actividad.id;
    const competencias = (actividad.competenciasReforzar || []) as string[];
    const competenciasEstandarSet = new Set(['COMUNICACION_EFECTIVA', 'TRABAJO_EN_EQUIPO', 'LIDERAZGO', 'PENSAMIENTO_CRITICO', 'RESPONSABILIDAD_Y_ETICA', 'TOMA_DE_DECISIONES', 'AUTOGESTION_Y_DISCIPLINA', 'PARTICIPACION_SOCIAL', 'OTRO']);
    const otraCompetencia: string = competencias.find(c => !competenciasEstandarSet.has(c)) || '';
    const competenciasFiltradas = competencias.filter(c => c !== 'OTRO' && c !== otraCompetencia);

    const evidencias = (actividad.tiposEvidenciaRequerida || []) as string[];
    const evidenciasEstandarSet = new Set(['LISTA_ASISTENCIA_FIRMADA', 'FOTOGRAFIA', 'CONSTANCIA_DOCUMENTO', 'PRODUCTO_REPORTE_ELABORADO', 'OTRO']);
    const otraEvidencia: string = evidencias.find(e => !evidenciasEstandarSet.has(e)) || '';
    const evidenciasFiltradas = evidencias.filter(e => e !== 'OTRO' && e !== otraEvidencia);
    
    this.form = {
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      eje: actividad.eje,
      puntosTdi: actividad.puntosTdi,
      periodicidad: actividad.periodicidad,
      fechaInicio: actividad.fechaInicio || '',
      fechaFin: actividad.fechaFin || '',
      horasEfectivas: actividad.horasEfectivas,
      lugar: actividad.lugar,
      area: actividad.area || '',
      dimensionesFormacion: (actividad.dimensionesFormacion as string[] | undefined)?.join(',') || '',
      nivelImpacto: actividad.nivelImpacto,
      publicoObjetivo: actividad.publicoObjetivo || [],
      asignaturasRelacionadas: actividad.asignaturasRelacionadas || [],
      competenciasReforzar: competenciasFiltradas,
      competenciaOtro: otraCompetencia,
      tiposEvidenciaRequerida: evidenciasFiltradas,
      evidenciaOtro: otraEvidencia,
    };
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.form = this.formVacio();
  }

  guardar() {
    if (!this.form.titulo || !this.form.eje || !this.form.puntosTdi) return;
    this.guardando = true;

    const dto: ActividadDTO = {
      id: '',
      titulo: this.form.titulo,
      descripcion: this.form.descripcion,
      eje: this.form.eje as ActividadDTO['eje'],
      puntosTdi: this.form.puntosTdi,
      periodicidad: this.form.periodicidad as ActividadDTO['periodicidad'],
      fechaInicio: this.form.periodicidad === 'UNICA' ? this.form.fechaInicio : '',
      fechaFin: this.form.fechaFin || undefined,
      horasEfectivas: this.form.horasEfectivas,
      lugar: this.form.lugar,
      area: this.form.area,
      dimensionesFormacion: this.form.dimensionesFormacion as ActividadDTO['dimensionesFormacion'],
      nivelImpacto: this.form.nivelImpacto as ActividadDTO['nivelImpacto'],
      publicoObjetivo: this.form.publicoObjetivo as ActividadDTO['publicoObjetivo'],
      asignaturasRelacionadas: this.form.asignaturasRelacionadas as ActividadDTO['asignaturasRelacionadas'],
      competenciasReforzar: [...this.form.competenciasReforzar, ...(this.form.competenciaOtro?.trim() ? [this.form.competenciaOtro.trim()] : [])] as ActividadDTO['competenciasReforzar'],
      tiposEvidenciaRequerida: [...this.form.tiposEvidenciaRequerida, ...(this.form.evidenciaOtro?.trim() ? [this.form.evidenciaOtro.trim()] : [])] as ActividadDTO['tiposEvidenciaRequerida'],
      activa: true,
      createdAt: new Date(),
    };

    if (this.editandoId) {
      dto.id = this.editandoId;
      this.catalogoService.actualizar(this.editandoId, dto).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarFormulario();
          this.cargarActividades();
        },
        error: (err) => { 
          this.guardando = false; 
          this.cdr.detectChanges();
          alert(err.error?.message || 'Error al actualizar'); 
        },
      });
    } else {
      this.catalogoService.crear(dto).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarFormulario();
          this.cargarActividades();
        },
        error: (err) => { 
          this.guardando = false; 
          this.cdr.detectChanges();
          alert(err.error?.message || 'Error al crear'); 
        },
      });
    }
  }

  toggleActiva(actividad: ActividadDTO) {
    const op = actividad.activa
      ? this.catalogoService.desactivar(actividad.id)
      : this.catalogoService.activar(actividad.id);
    op.subscribe({ next: () => this.cargarActividades() });
  }

  ejeLabel(eje: string): string {
    const map: Record<string, string> = {
      'PERSONAL': 'Identidad Personal',
      'ENTORNO_SOCIAL': 'Entorno Social',
      'DEPORTIVO': 'Físico',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[eje] || eje;
  }

  periodicidadLabel(p: string): string {
    const map: Record<string, string> = { 'UNICA': 'Única', 'SEMANAL': 'Semanal', 'MENSUAL': 'Mensual', 'CUATRIMESTRAL': 'Cuatrimestral', 'ANUAL': 'Anual' };
    return map[p] || p;
  }

  private formVacio(): FormActividad {
    return {
      titulo: '',
      descripcion: '',
      eje: 'ENTORNO_SOCIAL',
      puntosTdi: 1,
      periodicidad: 'UNICA',
      fechaInicio: '',
      fechaFin: '',
      horasEfectivas: undefined,
      lugar: 'INTERNO',
      area: '',
      dimensionesFormacion: '',
      nivelImpacto: undefined,
      publicoObjetivo: [],
      asignaturasRelacionadas: [],
      competenciasReforzar: [],
      competenciaOtro: '',
      tiposEvidenciaRequerida: [],
      evidenciaOtro: '',
    };
  }
}

interface FormActividad {
  titulo: string;
  descripcion: string;
  eje: string;
  puntosTdi: number;
  periodicidad: string;
  fechaInicio: string;
  fechaFin: string;
  horasEfectivas?: number;
  lugar?: 'INTERNO' | 'EXTERNO';
  area?: string;
  dimensionesFormacion: string;
  nivelImpacto?: string;
  publicoObjetivo: string[];
  asignaturasRelacionadas: string[];
  competenciasReforzar: string[];
  competenciaOtro: string;
  tiposEvidenciaRequerida: string[];
  evidenciaOtro: string;
}
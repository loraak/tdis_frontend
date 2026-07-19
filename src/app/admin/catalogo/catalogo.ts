import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CatalogoService } from '../../core/services/catalogo.service';
import { ActividadDTO } from '../../core/models/actividad';

@Component({
  selector: 'app-admin-catalogo',
  imports: [CommonModule, FormsModule, CardModule, TagModule],
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
  PERIODICIDADES = ['UNICA', 'SEMANAL', 'MENSUAL'];

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
    this.form = {
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      eje: actividad.eje,
      puntosTdi: actividad.puntosTdi,
      periodicidad: actividad.periodicidad,
      fechaInicio: actividad.fechaInicio || '',
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
        error: () => { this.guardando = false; this.cdr.detectChanges(); },
      });
    } else {
      this.catalogoService.crear(dto).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarFormulario();
          this.cargarActividades();
        },
        error: () => { this.guardando = false; this.cdr.detectChanges(); },
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
      'ENTORNO_SOCIAL': 'Entorno Social',
      'PERSONAL': 'Personal',
      'DEPORTIVO': 'Deportivo',
      'TRASCENDENCIA': 'Trascendencia',
    };
    return map[eje] || eje;
  }

  periodicidadLabel(p: string): string {
    const map: Record<string, string> = { 'UNICA': 'Única', 'SEMANAL': 'Semanal', 'MENSUAL': 'Mensual' };
    return map[p] || p;
  }

  private formVacio(): FormActividad {
    return { titulo: '', descripcion: '', eje: 'ENTORNO_SOCIAL', puntosTdi: 1, periodicidad: 'UNICA', fechaInicio: '' };
  }
}

interface FormActividad {
  titulo: string;
  descripcion: string;
  eje: string;
  puntosTdi: number;
  periodicidad: string;
  fechaInicio: string;
}

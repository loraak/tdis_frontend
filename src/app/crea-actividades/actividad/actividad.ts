import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CatalogoService } from '../../core/services/catalogo.service';
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
  tipoActividad = computed(() => this.auth.rol() || '');
  descripcion = '';
  reflexion = '';

  nombreResponsable = '';
  correoResponsable = '';
  nombreInEx: any;
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
    const rol = this.auth.rol();
    if (rol === 'INTERNO') this.router.navigate(['/interno/mis-actividades']);
    else if (rol === 'EXTERNO') this.router.navigate(['/externo/mis-actividades']);
    else this.router.navigate(['/alumno/mis-solicitudes']);
  }

  cambiarTipoActividad(tipo: any): void {
    this.tipoActividad = tipo;
  }

  seleccionarDivision(val: string) { this.division = val; }
  seleccionarTurno(val: string) { this.turno = val; }

  private mapearEje(eje: string): ActividadDTO['eje'] | null {
    const map: Record<string, ActividadDTO['eje']> = {
      'Identidad': 'PERSONAL',
      'Social': 'ENTORNO_SOCIAL',
      'Fisico': 'DEPORTIVO',
      'Trascendencia': 'TRASCENDENCIA',
    };
    return map[eje] ?? null;
  }

  private mapearPuntos(nivel: string): number {
    const map: Record<string, number> = {
      'Explorador': 5,
      'Promotor': 10,
      'Líder': 15,
      'Embajador': 20,
    };
    return map[nivel] ?? 5;
  }

  onSubmit() {
    if (!this.actividadSeleccionada && !this.nombreActividad) return;
    this.loading = true;
    this.error = '';

    const user = this.auth.usuario();
    const rol = this.auth.rol();

    const eje = this.mapearEje(this.ejeSeleccionado);
    if (!eje) {
      this.error = 'Selecciona un eje de desarrollo integral';
      this.loading = false;
      return;
    }

    const actividad: ActividadDTO = {
      id: '',
      titulo: this.nombreActividad,
      descripcion: this.descripcion || this.origenActividad || '',
      eje,
      puntosTdi: this.mapearPuntos(this.nivel),
      periodicidad: (this.periodicidad as ActividadDTO['periodicidad']) || 'UNICA',
      fechaInicio: this.fechaInicio || '',
      fechaFin: this.fechaFin || undefined,
      lugar: rol === 'EXTERNO' ? 'EXTERNO' : 'INTERNO',
      area: this.area,
      activa: false,
      creadorId: user?.usuarioId,
      creadorTipo: rol as ActividadDTO['creadorTipo'],
      createdAt: new Date(),
    };

    this.catalogoService.crear(actividad).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar actividad';
        this.loading = false;
      },
    });
  }
}

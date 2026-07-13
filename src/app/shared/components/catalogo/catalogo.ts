import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { ActividadDTO } from '../../../core/models/actividad';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule, CardModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  private catalogoService = inject(CatalogoService);
  private auth = inject(Auth);
  private router = inject(Router);
  rolUsuario = computed(() => this.auth.rol() || '');

  actividades = signal<ActividadDTO[]>([]);
  filtroActivo = signal<string>('TODAS');

  EJES = ['ENTORNO_SOCIAL', 'PERSONAL', 'DEPORTIVO', 'TRASCENDENCIA'];
  TIEMPO = ['UNICA', 'SEMANAL', 'MENSUAL']

  ngOnInit() {
    this.cargarActividades();
  }

  cargarActividades() {
    this.catalogoService.listarActivas().subscribe({
      next: (data) => this.actividades.set(data),
    });
  }

  filtrar(eje: string) {
    this.filtroActivo.set(eje);
  }

  get totalActividades(): number {
    return this.actividades().length;
  }

  get actividadesFiltradas(): ActividadDTO[] {
    const filtro = this.filtroActivo();
    if (filtro === 'TODAS') return this.actividades();
    if (this.EJES.includes(filtro)) return this.actividades().filter(a => a.eje === filtro);
    if (this.TIEMPO.includes(filtro)) return this.actividades().filter(a => a.periodicidad === filtro);
    return this.actividades();
  }

  conteoEje(eje: string): number {
    return this.actividades().filter(a => a.eje === eje).length;
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

  ejeIcon(eje: string): string {
    const map: Record<string, string> = {
      'ENTORNO_SOCIAL': 'pi pi-users',
      'PERSONAL': 'pi pi-book',
      'DEPORTIVO': 'pi pi-percentage',
      'TRASCENDENCIA': 'pi pi-sparkles',
    };
    return map[eje] || 'pi pi-question';
  }

  tiempoLabel(tiempo: string): string {
    const map: Record<string, string> = {
      'UNICA': 'Única ocasión',
      'SEMANAL': 'Semanal',
      'MENSUAL': 'Mensual'
    };
    return map[tiempo] || tiempo;
  }

  periodicidadLabel(periodicidad: string): string {
    const map: Record<string, string> = {
      'UNICA': 'Única ocasión',
      'SEMANAL': 'Semanal',
      'MENSUAL': 'Mensual'
    };
    return map[periodicidad] || periodicidad;
  }

  cardEjeClass(eje: string): string {
    const map: Record<string, string> = {
      'ENTORNO_SOCIAL': 'card-eje-social',
      'PERSONAL': 'card-eje-personal',
      'DEPORTIVO': 'card-eje-deportivo',
      'TRASCENDENCIA': 'card-eje-trascendencia',
    };
    return map[eje] || '';
  }

  badgeEjeClass(eje: string): string {
    const map: Record<string, string> = {
      'ENTORNO_SOCIAL': 'social',
      'PERSONAL': 'personal',
      'DEPORTIVO': 'deportivo',
      'TRASCENDENCIA': 'trascendencia',
    };
    return map[eje] || '';
  }

  seleccionarActividad(actividad: ActividadDTO) {
    if (this.rolUsuario() === 'ALUMNO') {
      this.router.navigate(['/alumno/nueva-solicitud'], { queryParams: { actividadId: actividad.id } });
    }
  }
}

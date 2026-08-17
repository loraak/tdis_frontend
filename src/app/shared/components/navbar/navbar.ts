import { Component, OnInit, computed, inject, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { AdminService } from '../../../core/services/admin.service';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { CatalogoService } from '../../../core/services/catalogo.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);
  private adminService = inject(AdminService);
  private solicitudesService = inject(SolicitudesService);
  private catalogoService = inject(CatalogoService);
  private cdr = inject(ChangeDetectorRef);

  isAdmin: boolean = false;
  rolUsuario = computed(() => this.auth.rol() || '');
  isSolicitante: boolean = true;
  rol: string = 'INTERNO';

  totalAlumnos = 0;
  actividadesAprobadas = 0;
  actividadesRechazadas = 0;
  solicitudesPendientes = 0;
  actividadesPendientes = 0;
  solicitudesAlumno = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = this.auth.usuario();
    if (this.auth.isAdmin()) {
      this.adminService.obtenerResumen().subscribe(data => {
        this.totalAlumnos = data.totalAlumnos;
        this.actividadesAprobadas = data.actividadesAprobadas;
        this.actividadesRechazadas = data.actividadesRechazadas;
        this.cdr.detectChanges();
      });
      this.solicitudesService.listarPorEstado('EN_REVISION').subscribe(sols => {
        this.solicitudesPendientes = sols.length;
        this.cdr.detectChanges();
      });
      this.solicitudesService.listarTodas().subscribe(sols => {
        this.actividadesPendientes = sols.filter(s => s.tipoSolicitud === 'PREVIA' && (s.estado === 'EN_REVISION' || s.estado === 'REVISION_HUMANA')).length;
        this.cdr.detectChanges();
      });
      this.solicitudesService.listarPorEstado('RECHAZADA').subscribe(sols => {
        // no se usa directamente, pero se puede agregar si se quiere
      });
    } else if (usuario && usuario.usuarioId) {
      this.solicitudesService.listarPorAlumno(usuario.usuarioId).subscribe(sols => {
        this.solicitudesAlumno = sols.length;
        this.cdr.detectChanges();
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/admin')) this.rol = 'ADMIN';
      else if (url.includes('/externo')) this.rol = 'EXTERNO';
      else if (url.includes('/interno')) this.rol = 'INTERNO';
      else this.rol = 'ALUMNO';
    });
  }

  evaluarRuta(url: string): void {
    this.isAdmin = url.includes('/admin') || this.auth.isAdmin();
  }
}

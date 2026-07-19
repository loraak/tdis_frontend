import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private auth = inject(Auth);

  isAdmin: boolean = false;
  rolUsuario = computed(() => this.auth.rol() || '');
  isSolicitante: boolean = true;
  rol: string = 'SOLICITANTE';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes('/admin')) this.rol = 'ADMIN';
      else if (url.includes('/externo')) this.rol = 'EXTERNO';
      else if (url.includes('/solicitante')) this.rol = 'SOLICITANTE';
      else this.rol = 'ALUMNO';
    });
  }

  evaluarRuta(url: string): void {
    this.isAdmin = url.includes('/admin') || this.auth.isAdmin();
  }
}

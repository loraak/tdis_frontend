import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  private auth = inject(Auth);

  isAdmin: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.evaluarRuta(this.router.url);
    this.isAdmin = this.auth.isAdmin();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.evaluarRuta(event.urlAfterRedirects);
    });
  }

  evaluarRuta(url: string): void {
    this.isAdmin = url.includes('/admin');
  }

  getNombreUsuario(): string {
    const user = this.auth.usuario();
    if (!user) return '';
    return `${user.nombre} ${user.apellidos}`;
  }

  getMatricula(): string {
    return this.auth.usuario()?.matricula || '';
  }

  cerrarSesion(): void {
    this.auth.logout();
  }
}

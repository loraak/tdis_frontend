import { Component, OnInit, inject } from '@angular/core';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.evaluarRuta(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.evaluarRuta(event.urlAfterRedirects);
    });
  }

  evaluarRuta(url: string): void {
    this.isAdmin = url.includes('/admin') || this.auth.isAdmin();
  }
}

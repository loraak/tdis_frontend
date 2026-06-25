import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isAdmin: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.evaluarRuta(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.evaluarRuta(event.urlAfterRedirects);
    });
  }

  evaluarRuta(url: string): void {
    this.isAdmin = url.includes('/admin');
  }
}

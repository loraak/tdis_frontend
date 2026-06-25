import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
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

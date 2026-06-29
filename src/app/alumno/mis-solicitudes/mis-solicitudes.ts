import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CardModule, TagModule],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.css',
})
export class MisSolicitudes {
  estaComprimida: boolean = false;

  toggleCompresion(): void {
    this.estaComprimida = !this.estaComprimida;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-nueva-solicitud',
  imports: [CommonModule, InputTextModule, CardModule],
  templateUrl: './nueva-solicitud.html',
  styleUrl: './nueva-solicitud.css',
})
export class NuevaSolicitud {
  tipoFormulario: string = 'EVIDENCIA'; 

  cambiarTipo(tipo: string): void {
    this.tipoFormulario = tipo;
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size);
    }
  }
}

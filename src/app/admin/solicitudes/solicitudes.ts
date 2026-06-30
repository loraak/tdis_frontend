import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

interface Comentario {
  id: number;
  remitente: 'alumno' | 'coordinacion';
  nombre: string;
  mensaje: string;
  fecha: string;
  icon: string;
}

@Component({
  selector: 'app-solicitudes',
  imports: [CardModule, TagModule, CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes {
  estaComprimida: boolean = true;

  toggleCompresion(): void {
    this.estaComprimida = !this.estaComprimida;
  }

  comentarios: Comentario[] = [
    {
      id: 1,
      remitente: 'alumno',
      nombre: 'Juan Pablo',
      mensaje: 'Holaaa',
      fecha: '30/5/2026, 6:43:24 p.m.',
      icon: 'pi pi-user'
    },
    {
      id: 2,
      remitente: 'coordinacion',
      nombre: 'Coordinación',
      mensaje: 'Holla',
      fecha: '30/5/2026, 6:43:46 p.m.',
      icon: 'pi pi-shield'
    }
  ];

  nuevoComentario: string = '';

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;

    // Simulación de envío por parte del rol actual (ej. Coordinación o Alumno)
    this.comentarios.push({
      id: this.comentarios.length + 1,
      remitente: 'coordinacion', // Aquí dependerá de quién tenga la sesión activa
      nombre: 'Coordinación',
      mensaje: this.nuevoComentario,
      fecha: new Date().toLocaleString(),
      icon: 'pi pi-shield'
    });

    this.nuevoComentario = ''; // Limpiamos el input
  }
}

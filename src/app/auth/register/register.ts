import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  loading = signal(false);
  error = signal('');
  success = signal(false);

  nombre = '';
  apellidos = '';
  matricula = '';
  email = '';
  password = '';
  confirmPassword = '';
  division = '';
  programa = '';
  grupo = '';
  cuatrimestre = '';
  turno = '';
  tutor = '';

  submitted = false;

  private auth = inject(Auth);
  private router = inject(Router);

  seleccionarDivision(val: string) {
    this.division = val;
  }

  seleccionarTurno(val: string) {
    this.turno = val;
  }

  isFormValid(): boolean {
    return !!(
      this.nombre.trim() &&
      this.apellidos.trim() &&
      this.matricula.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim() &&
      this.password === this.confirmPassword &&
      this.password.length >= 6 &&
      this.matricula.length >= 8 &&
      this.division &&
      this.programa.trim() &&
      this.grupo.trim() &&
      this.cuatrimestre.trim() &&
      this.turno
    );
  }

  getErrorMessage(): string {
    if (!this.nombre.trim()) return 'El nombre es requerido';
    if (!this.apellidos.trim()) return 'Los apellidos son requeridos';
    if (!this.matricula.trim()) return 'La matricula es requerida';
    if (this.matricula.length < 8) return 'La matricula debe tener al menos 8 digitos';
    if (!this.email.trim()) return 'El correo institucional es requerido';
    if (!this.password.trim()) return 'La contrasena es requerida';
    if (this.password.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
    if (!this.confirmPassword.trim()) return 'Confirma tu contrasena';
    if (this.password !== this.confirmPassword) return 'Las contrasenas no coinciden';
    if (!this.division) return('Selecciona tu division');
    if (!this.programa.trim()) return 'El programa academico es requerido';
    if (!this.grupo.trim()) return 'El grupo es requerido';
    if (!this.cuatrimestre.trim()) return 'El cuatrimestre es requerido';
    if (!this.turno) return 'Selecciona tu turno';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    this.error.set('');

    if (!this.isFormValid()) {
      this.error.set(this.getErrorMessage());
      return;
    }

    this.loading.set(true);

    this.auth.register({
      matricula: this.matricula.trim(),
      email: this.email.trim(),
      password: this.password,
      nombre: this.nombre.trim(),
      apellidos: this.apellidos.trim(),
    }).subscribe({
      next: () => {
        const studentProfile = {
          division: this.division,
          programa: this.programa.trim(),
          grupo: this.grupo.trim(),
          cuatrimestre: this.cuatrimestre.trim(),
          turno: this.turno,
          tutor: this.tutor.trim(),
        };
        localStorage.setItem('tdis_student_profile', JSON.stringify(studentProfile));
        this.success.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear la cuenta');
        this.loading.set(false);
      },
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}

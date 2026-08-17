import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register-interno',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, RouterLink],
  templateUrl: './register-interno.html',
  styleUrl: './register-interno.css',
})
export class RegisterInterno {
  loading = signal(false);
  error = signal('');
  success = signal(false);

  matricula = '';
  email = '';
  password = '';
  confirmPassword = '';
  nombre = '';
  apellidos = '';

  submitted = false;

  private auth = inject(Auth);
  private router = inject(Router);

  isFormValid(): boolean {
    return !!(
      this.matricula.trim() &&
      this.matricula.trim().length >= 8 &&
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim() &&
      this.password === this.confirmPassword &&
      this.password.length >= 6 &&
      this.nombre.trim() &&
      this.apellidos.trim()
    );
  }

  getErrorMessage(): string {
    if (!this.matricula.trim()) return 'La matricula es requerida';
    if (this.matricula.trim().length < 8) return 'La matricula debe tener al menos 8 digitos';
    if (!this.email.trim()) return 'El correo institucional es requerido';
    if (!this.password.trim()) return 'La contrasena es requerida';
    if (this.password.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
    if (!this.confirmPassword.trim()) return 'Confirma tu contrasena';
    if (this.password !== this.confirmPassword) return 'Las contrasenas no coinciden';
    if (!this.nombre.trim()) return 'El nombre es requerido';
    if (!this.apellidos.trim()) return 'Los apellidos son requeridos';
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

    this.auth.registerInterno({
      matricula: this.matricula.trim(),
      email: this.email.trim(),
      password: this.password,
      nombre: this.nombre.trim(),
      apellidos: this.apellidos.trim(),
    }).subscribe({
      next: () => {
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

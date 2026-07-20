import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register-externo',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, RouterLink],
  templateUrl: './register-externo.html',
  styleUrl: './register-externo.css',
})
export class RegisterExterno {
  loading = signal(false);
  error = signal('');
  success = signal(false);

  tipo: 'PERSONA' | 'ORGANIZACION' | '' = '';
  nombre = '';
  apellidos = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;

  private auth = inject(Auth);
  private router = inject(Router);

  seleccionarTipo(val: 'PERSONA' | 'ORGANIZACION') {
    this.tipo = val;
    this.nombre = '';
    this.apellidos = '';
  }

  isFormValid(): boolean {
    if (!this.tipo || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) return false;
    if (this.password !== this.confirmPassword) return false;
    if (this.password.length < 6) return false;
    if (this.tipo === 'ORGANIZACION') return !!this.nombre.trim();
    return !!this.nombre.trim() && !!this.apellidos.trim();
  }

  getErrorMessage(): string {
    if (!this.tipo) return 'Selecciona tu tipo de cuenta';
    if (!this.nombre.trim()) return this.tipo === 'ORGANIZACION' ? 'El nombre de la organizacion es requerido' : 'El nombre es requerido';
    if (this.tipo === 'PERSONA' && !this.apellidos.trim()) return 'Los apellidos son requeridos';
    if (!this.email.trim()) return 'El correo electronico es requerido';
    if (!this.password.trim()) return 'La contrasena es requerida';
    if (this.password.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
    if (!this.confirmPassword.trim()) return 'Confirma tu contrasena';
    if (this.password !== this.confirmPassword) return 'Las contrasenas no coinciden';
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

    this.auth.registerExterno({
      tipo: this.tipo as 'PERSONA' | 'ORGANIZACION',
      nombre: this.nombre.trim(),
      apellidos: this.tipo === 'ORGANIZACION' ? '' : this.apellidos.trim(),
      email: this.email.trim(),
      password: this.password,
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

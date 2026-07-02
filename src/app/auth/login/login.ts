import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Auth } from '../../core/services/auth';
type LoginView = 'select-role' | 'admin' | 'student';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  currentView = signal<LoginView>('select-role');
  matricula: string = '';
  email: string = '';
  password: string = '';
  loading = signal(false);
  error = signal('');

  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([this.auth.isAdmin() ? '/admin/resumen' : '/alumno/progreso']);
    }
  }

  setView(view: LoginView) {
    this.currentView.set(view);
    this.error.set('');
  }

  onStudentSubmit() {
    if (!this.matricula.trim()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login({ credencial: this.matricula.trim() }).subscribe({
      next: () => {
        this.router.navigate(['/alumno/progreso']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al consultar matrícula');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  onAdminSubmit() {
    if (!this.email.trim() || !this.password.trim()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login({ credencial: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/admin/resumen']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Credenciales inválidas');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}

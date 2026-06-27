import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
type LoginView = 'select-role' | 'admin' | 'student';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, CardModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  currentView = signal<LoginView>('select-role');
  
  matricula: string = '';

  setView(view: LoginView) {
    this.currentView.set(view);
  }

  onStudentSubmit() {
    console.log('Consultando progreso para matrícula:', this.matricula);
  }

  onAdminSubmit() {
    console.log('Login de administrador');
  }
}

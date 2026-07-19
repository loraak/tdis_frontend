import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterExternoRequest } from '../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private tokenKey = 'tdis_token';
  private userKey = 'tdis_user';
  private profileKey = 'tdis_student_profile';

  usuario = signal<LoginResponse | null>(null);
  isAuthenticated = signal(false);
  isAdmin = signal(false);
  isExterno = signal(false);
  rol = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.cargarSesion();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((res) => {
        this.guardarSesion(res);
      })
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, request).pipe(
      tap((res) => {
        this.guardarSesion(res);
      })
    );
  }

  registerExterno(request: RegisterExternoRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register-externo`, request).pipe(
      tap((res) => {
        this.guardarSesion(res);
      })
    );
  }

  getStudentProfile(): { division: string; programa: string; grupo: string; cuatrimestre: string; turno: string; tutor: string } | null {
    const data = localStorage.getItem(this.profileKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.usuario.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    this.isExterno.set(false);
    this.rol = signal<string | null>(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private guardarSesion(res: LoginResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res));
    this.usuario.set(res);
    this.isAuthenticated.set(true);
    this.isAdmin.set(res.tipoUsuario === 'ADMINISTRADOR');
    this.isExterno.set(res.tipoUsuario === 'EXTERNO');
    this.rol.set(res.tipoUsuario);
  }

  private cargarSesion(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userData = localStorage.getItem(this.userKey);
    if (token && userData) {
      try {
        const user = JSON.parse(userData) as LoginResponse;
        this.usuario.set(user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(user.tipoUsuario === 'ADMINISTRADOR');
        this.isExterno.set(user.tipoUsuario === 'EXTERNO');
        this.rol.set(user.tipoUsuario);
      } catch {
        this.logout();
      }
    }
  }
}

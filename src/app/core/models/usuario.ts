export interface LoginRequest {
  credencial: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: string;
  matricula?: string;
  email?: string;
  nombre: string;
  apellidos: string;
  tipoUsuario: 'ALUMNO' | 'ADMINISTRADOR';
}

export interface RegisterRequest {
  matricula: string;
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
}

export interface UsuarioDTO {
  id: string;
  matricula?: string;
  email?: string;
  nombre: string;
  apellidos: string;
  tipoUsuario: 'ALUMNO' | 'ADMINISTRADOR';
  activo: boolean;
}

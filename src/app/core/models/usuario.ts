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
  tipoUsuario: 'ALUMNO' | 'ADMINISTRADOR' | 'EXTERNO' | 'INTERNO';
}

export interface RegisterRequest {
  matricula: string;
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
}

export interface RegisterExternoRequest {
  tipo: 'PERSONA' | 'ORGANIZACION';
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface UsuarioDTO {
  id: string;
  matricula?: string;
  email?: string;
  nombre: string;
  apellidos: string;
  tipoUsuario: 'ALUMNO' | 'ADMINISTRADOR' | 'EXTERNO';
  activo: boolean;
}

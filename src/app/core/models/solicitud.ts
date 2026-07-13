export interface CrearSolicitudRequest {
  actividadId: string;
  tipoSolicitud?: string;
  descripcion?: string;
  reflexion?: string;
  lugar?: string;
  horas?: string;
  tipoActividad?: string;
  materiaRelacionada?: string;
  division?: string;
  programa?: string;
  grupo?: string;
  cuatrimestre?: string;
  turno?: string;
  tutor?: string;
  nombreResponsable?: string;
  cargoResponsable?: string;
  telefonoResponsable?: string;
  correoResponsable?: string;
}

export interface SolicitudDTO {
  id: string;
  alumnoId: string;
  alumnoMatricula?: string;
  alumnoNombre?: string;
  tipoSolicitud?: string;
  actividadId: string;
  actividadTitulo?: string;
  actividadEje?: string;
  actividadPuntos?: number;
  descripcion?: string;
  reflexion?: string;
  lugar?: string;
  horas?: string;
  tipoActividad?: string;
  materiaRelacionada?: string;
  division?: string;
  programa?: string;
  grupo?: string;
  cuatrimestre?: string;
  turno?: string;
  tutor?: string;
  nombreResponsable?: string;
  cargoResponsable?: string;
  telefonoResponsable?: string;
  correoResponsable?: string;
  nombreArchivo?: string;
  estado: 'EN_REVISION' | 'APROBADA' | 'RECHAZADA' | 'REVISION_HUMANA';
  comentarioRechazo?: string;
  archivoPath?: string;
  aiEstado?: string;
  aiMotivo?: string;
  aiDescripcionAnalisis?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RevisarSolicitudRequest {
  estado: 'APROBADA' | 'RECHAZADA';
  comentario?: string;
}

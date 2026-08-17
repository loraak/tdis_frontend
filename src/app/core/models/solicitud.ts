export interface CrearSolicitudRequest {
  actividadId?: string;
  nombreActividad?: string;
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
  // Solicitud Previa
  dimensionesFormacion?: string;
  nivelImpacto?: string;
  publicoObjetivo?: string;
  asignaturasRelacionadas?: string;
  competenciasReforzar?: string;
  evidenciasRequeridas?: string;
  justificacionPersonal?: string;
  impactoAcademico?: string;
  asistenciaEsperada?: string;
  alumnosGeneranTdi?: string;
  horasEstimadas?: string;
  periodicidad?: string;
  fechaInicio?: string;
  fechaFin?: string;
  // Campos de Actividad para PREVIA
  eje?: 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi?: number;
  horasEfectivas?: number;
  tipoLugar?: 'INTERNO' | 'EXTERNO';
}

export interface SolicitudDTO {
  id: string;
  alumnoId: string;
  alumnoMatricula?: string;
  alumnoNombre?: string;
  tipoSolicitud?: string;
  actividadId?: string;
  nombreActividad?: string;
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
  dimensionesFormacion?: string;
  nivelImpacto?: string;
  publicoObjetivo?: string;
  asignaturasRelacionadas?: string;
  competenciasReforzar?: string;
  evidenciasRequeridas?: string;
  justificacionPersonal?: string;
  impactoAcademico?: string;
  asistenciaEsperada?: string;
  alumnosGeneranTdi?: string;
  horasEstimadas?: string;
  periodicidad?: string;
  fechaInicio?: string;
  fechaFin?: string;
  createdAt: string;
  updatedAt?: string;
  // Campos de Actividad para PREVIA
  eje?: 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi?: number;
  horasEfectivas?: number;
  tipoLugar?: 'INTERNO' | 'EXTERNO';
}

export interface RevisarSolicitudRequest {
  estado: 'APROBADA' | 'RECHAZADA';
  comentario?: string;
}

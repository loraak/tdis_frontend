export interface ActividadDTO {
  id: string;
  titulo: string;
  descripcion: string;
  eje: 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi: number;
  periodicidad: 'UNICA' | 'SEMANAL' | 'MENSUAL';
  fechaInicio: string;
  fechaFin?: string;
  activa: boolean;
  estadoRevision?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  creadorId?: string;
  creadorNombre?: string;
  creadorTipo?: 'INTERNO' | 'EXTERNO' | 'ADMINISTRADOR' | 'ALUMNO';
  comentarioRevision?: string;
  createdAt: Date;
  updatedAt?: Date;
}

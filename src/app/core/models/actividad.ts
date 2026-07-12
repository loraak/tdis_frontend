export interface ActividadDTO {
  id: string;
  titulo: string;
  descripcion: string;
  eje: 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi: number;
  temporalidad: string;
  activa: boolean;
  createdAt: Date;
}

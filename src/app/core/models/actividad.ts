export interface ActividadDTO {
  id: string;
  titulo: string;
  descripcion: string;
  eje: 'ENTORNO_SOCIAL' | 'CULTURAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi: number;
  temporalidad: string;
  activa: boolean;
}

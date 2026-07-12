export interface ProgresoDTO {
  alumnoId: string;
  alumnoMatricula?: string;
  alumnoNombre?: string;
  puntosTotales: number;
  nivelActual: 'EXPLORADOR' | 'PROMOTOR' | 'LIDER' | 'EMBAJADOR';
  puntosPorEje: { [key: string]: number };
  actividadesCompletadas: number;
  actividadesEnRevision: number;
  puntosSiguienteNivel?: number;
  porcentajeProgreso?: number;
}

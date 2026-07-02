export interface ProgresoDTO {
  alumnoId: string;
  alumnoMatricula?: string;
  alumnoNombre?: string;
  puntosTotales: number;
  nivelActual: 'SENSIBILIZADOR' | 'FORMATIVO' | 'APLICATIVO' | 'IMPLEMENTADOR';
  puntosPorEje: { [key: string]: number };
  actividadesCompletadas: number;
  actividadesEnRevision: number;
  puntosSiguienteNivel?: number;
  porcentajeProgreso?: number;
}

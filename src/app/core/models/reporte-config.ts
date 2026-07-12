export interface ReporteConfig {
  // Secciones "clásicas"
  incluirTablaAlumnos: boolean;       // tabla simple, todos los alumnos
  incluirGraficos: boolean;           // captura donut + barras (requiere refs)
  incluirMetricasResumen: boolean;    // línea con totales arriba

  // Secciones "filtradas"
  incluirAlumnosNuevos: boolean;
  diasAlumnosNuevos: number;

  incluirActividadesRecientes: boolean;
  diasActividadesRecientes: number;

  incluirCambiosNivel: boolean;
  nivelObjetivo?: string;

  incluirEstadisticasNiveles: boolean;
}

export const REPORTE_ALUMNOS_PRESET: ReporteConfig = {
  incluirTablaAlumnos: true,
  incluirGraficos: false,
  incluirMetricasResumen: false,
  incluirAlumnosNuevos: false, diasAlumnosNuevos: 7,
  incluirActividadesRecientes: false, diasActividadesRecientes: 7,
  incluirCambiosNivel: false,
  incluirEstadisticasNiveles: false
};

export const REPORTE_COMPLETO_PRESET: ReporteConfig = {
  incluirTablaAlumnos: true,
  incluirGraficos: true,
  incluirMetricasResumen: true,
  incluirAlumnosNuevos: false, diasAlumnosNuevos: 7,
  incluirActividadesRecientes: false, diasActividadesRecientes: 7,
  incluirCambiosNivel: false,
  incluirEstadisticasNiveles: true
};

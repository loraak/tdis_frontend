export interface ActividadDTO {
  id: string;
  titulo: string;
  descripcion: string;
  eje: 'ENTORNO_SOCIAL' | 'PERSONAL' | 'DEPORTIVO' | 'TRASCENDENCIA';
  puntosTdi: number;
  periodicidad: 'UNICA' | 'SEMANAL' | 'MENSUAL' | 'CUATRIMESTRAL' | 'ANUAL';
  fechaInicio: string;
  fechaFin?: string;
  horasEfectivas?: number;
  lugar?: 'INTERNO' | 'EXTERNO';
  dimensionesFormacion?: 'IDENTIDAD_PERSONAL' | 'ENTORNO_SOCIAL' | 'ENTORNO_FISICO' | 'TRASCENDENCIA';
  nivelImpacto?: 'SENSIBILIZADOR' | 'FORMATIVO' | 'APLICACION' | 'IMPLEMENTADOR';
  publicoObjetivo?: ('SOLO_ALUMNAS' | 'SOLO_ALUMNOS' | 'SOLO_DIVISION_INDUSTRIAL' | 'SOLO_DIVISION_ECONOMICO_ADMINISTRATIVA' | 'SOLO_DIVISION_TECNOLOGIAS' | 'SOLO_DIVISION_IDIOMAS' | 'TODAS_LAS_DIVISIONES')[];
  asignaturasRelacionadas?: ('DESARROLLO_HUMANO_Y_VALORES' | 'HABILIDADES_SOCIOEMOCIONALES' | 'DESARROLLO_DEL_PENSAMIENTO_CRITICO' | 'ETICA_Y_VALORES' | 'LIDERAZGO_DE_EQUIPOS_DE_ALTO_DESEMPENO' | 'HABILIDADES_GERENCIALES')[];
  competenciasReforzar?: ('COMUNICACION_EFECTIVA' | 'TRABAJO_EN_EQUIPO' | 'LIDERAZGO' | 'PENSAMIENTO_CRITICO' | 'RESPONSABILIDAD_Y_ETICA' | 'TOMA_DE_DECISIONES' | 'AUTOGESTION_Y_DISCIPLINA' | 'PARTICIPACION_SOCIAL' | 'OTRO')[];
  tiposEvidenciaRequerida?: ('LISTA_ASISTENCIA_FIRMADA' | 'FOTOGRAFIA' | 'CONSTANCIA_DOCUMENTO' | 'PRODUCTO_REPORTE_ELABORADO' | 'OTRO')[];
  activa: boolean;
  estadoRevision?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  area?: string;
  creadorId?: string;
  creadorNombre?: string;
  creadorTipo?: 'INTERNO' | 'EXTERNO' | 'ADMINISTRADOR' | 'ALUMNO';
  nombreResponsable?: string;
  telefonoResponsable?: string;
  comentarioRevision?: string;
  createdAt: Date;
  updatedAt?: Date;
}
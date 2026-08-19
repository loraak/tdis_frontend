export interface AdminResumenDTO {
  totalAlumnos: number;
  actividadesAprobadas: number;
  actividadesRechazadas: number;
  puntosDistribuidos: number;
  distribucionNiveles: { [key: string]: number };
  puntosPorEje: { [key: string]: number };
  topAlumnos: AlumnoResumenDTO[];
}

export interface AlumnoResumenDTO {
  id: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  nivel: string;
  personal: number;
  social: number;
  division?: string;
  dep: number;
  trasc: number;
  total: number;
  createdAt: Date;
  tutor?: string;
}

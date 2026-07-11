import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReporteConfig } from '../models/reporte-config';
import html2canvas from 'html2canvas-pro';
import { AlumnoResumenDTO } from '../models/admin';
import { ActividadDTO } from '../models/actividad';

interface Metricas {
  totalAlumnos: number;
  aprobadas: number;
  rechazadas: number;
  puntos: number;
}

interface ChartRefs {
  donutEl?: HTMLElement;
  barrasEl?: HTMLElement;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {

  async generarReporte(
    config: ReporteConfig,
    alumnos: AlumnoResumenDTO[],
    actividades: ActividadDTO[],
    metricas?: Metricas,
    charts?: ChartRefs
  ): Promise<void> {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text('Reporte de actividades', 14, y);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, 14, y + 6);
    y += 16;

    // --- Métricas resumen ---
    if (config.incluirMetricasResumen && metricas) {
      doc.setFontSize(10);
      doc.text(
        `Alumnos: ${metricas.totalAlumnos}  |  Aprobadas: ${metricas.aprobadas}  |  Rechazadas: ${metricas.rechazadas}  |  Puntos: ${metricas.puntos}`,
        14, y
      );
      y += 10;
    }

    // --- Gráficos ---
    if (config.incluirGraficos && charts?.donutEl && charts?.barrasEl) {
      const donutImg = await this.capturarElemento(charts.donutEl);
      const barrasImg = await this.capturarElemento(charts.barrasEl);
      doc.addImage(donutImg, 'PNG', 14, y, 85, 60);
      doc.addImage(barrasImg, 'PNG', 105, y, 90, 60);
      y += 70;
    }

    // --- Tabla completa de alumnos ---
    if (config.incluirTablaAlumnos) {
      y = this.agregarSeccionTabla(doc, y,
        `Alumnos — ${alumnos.length}`,
        ['#', 'Matrícula', 'Nivel', 'Cult.', 'Social', 'Dep.', 'Trasc.', 'Total'],
        alumnos.map(a => [a.id, a.matricula, a.nivel, a.cult, a.social, a.dep, a.trasc, a.total])
      );
    }

    // --- Alumnos nuevos ---
    if (config.incluirAlumnosNuevos) {
      const nuevos = this.filtrarPorDias(alumnos, 'createdAt', config.diasAlumnosNuevos);
      y = this.agregarSeccionTabla(doc, y,
        `Alumnos nuevos (últimos ${config.diasAlumnosNuevos} días) — ${nuevos.length}`,
        ['Matrícula', 'Nivel', 'Fecha registro'],
        nuevos.map(a => [a.matricula, a.nivel, this.formatDate(a.createdAt)])
      );
    }

    /* --- Actividades recientes ---
    if (config.incluirActividadesRecientes) {
      const recientes = this.filtrarPorDias(actividades, 'createdAt', config.diasActividadesRecientes);
      y = this.agregarSeccionTabla(doc, y,
        `Actividades recientes (últimos ${config.diasActividadesRecientes} días) — ${recientes.length}`,
        ['Alumno', 'Actividad', 'Estado', 'Fecha'],
        recientes.map(a => [a.alumnoMatricula, a.titulo, a.estado, this.formatDate(a.fechaSubida)])
      );
    }*/

    /* --- Cambios de nivel ---
    if (config.incluirCambiosNivel) {
      const filtrados = config.nivelObjetivo
        ? alumnos.filter(a => a.nivel === config.nivelObjetivo)
        : alumnos;
      y = this.agregarSeccionTabla(doc, y,
        `Alumnos por nivel${config.nivelObjetivo ? ': ' + config.nivelObjetivo : ''} — ${filtrados.length}`,
        ['Matrícula', 'Nivel', 'Fecha alcanzado'],
        filtrados.map(a => [a.matricula, a.nivel, this.formatDate(a.fechaUltimoNivel)])
      );
    }*/

    // --- Estadísticas por nivel ---
    if (config.incluirEstadisticasNiveles) {
      const stats = this.calcularStatsPorNivel(alumnos);
      y = this.agregarSeccionTabla(doc, y,
        'Estadísticas por nivel',
        ['Nivel', 'Cantidad', '% del total'],
        stats.map(s => [s.nivel, s.cantidad, `${s.porcentaje.toFixed(1)}%`])
      );
    }

    doc.save(`reporte-${Date.now()}.pdf`);
  }

  // --- Helpers privados ---

  private async capturarElemento(el: HTMLElement): Promise<string> {
    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
    return canvas.toDataURL('image/png');
  }

  private filtrarPorDias<T extends Record<string, any>>(items: T[], campoFecha: keyof T, dias: number): T[] {
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);
    return items.filter(item => new Date(item[campoFecha]) >= limite);
  }

  private calcularStatsPorNivel(alumnos: AlumnoResumenDTO[]) {
    const total = alumnos.length || 1;
    const conteo = alumnos.reduce((acc, a) => {
      acc[a.nivel] = (acc[a.nivel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(conteo).map(([nivel, cantidad]) => ({
      nivel, cantidad, porcentaje: (cantidad / total) * 100
    }));
  }

  private agregarSeccionTabla(doc: jsPDF, startY: number, titulo: string, head: string[], body: any[][]): number {
    if (startY > 250) { doc.addPage(); startY = 20; }

    doc.setFontSize(12);
    doc.text(titulo, 14, startY);

    autoTable(doc, {
      startY: startY + 4,
      head: [head],
      body: body.length ? body : [['Sin registros']],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 65, 85] },
      margin: { left: 14, right: 14 },
    });

    return (doc as any).lastAutoTable.finalY + 12;
  }

  private formatDate(d: Date): string {
    return new Date(d).toLocaleDateString('es-MX');
  }
}

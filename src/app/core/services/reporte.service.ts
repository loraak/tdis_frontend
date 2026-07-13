import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlumnoResumenDTO } from '../models/admin';
import { generarGraficoAlumnosRecientes, generarGraficoNiveles, generarGraficoEjes, generarGraficoActividadesRecientes, generarGraficoTemporalidad } from '../utils/reporte-charts.utils';
import { ActividadDTO } from '../models/actividad';

export interface ReporteActividadesData {
  actividades: ActividadDTO[];
  distribucionEjes: Record<string, number>;
  distribucionTemporalidad: Record<string, number>;
}
@Injectable({ providedIn: 'root' })
export class ReporteService {

  async generarReporteAlumnos(
    alumnos: AlumnoResumenDTO[],
    distribucionNiveles: Record<string, number>,
    puntosPorEje: Record<string, number>,
  ): Promise<void> {
    const doc = new jsPDF();
    let y = 18;

    doc.setFontSize(16);
    doc.text('Reporte completo', 14, y);
    y += 12;

    const imgNiveles = await generarGraficoNiveles(distribucionNiveles);
    doc.addImage(imgNiveles, 'PNG', 14, y, 85, 60);
    const imgEjes = await generarGraficoEjes(puntosPorEje);
    doc.addImage(imgEjes, 'PNG', 105, y, 90, 60);
    y += 70;

    const imgRecientes = await generarGraficoAlumnosRecientes(alumnos);
    doc.addImage(imgRecientes, 'PNG', 14, y, 180, 60);
    y += 65;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Matrícula', 'Nivel', 'Personal', 'Social', 'Dep.', 'Trasc.', 'Total']],
      body: alumnos.map((a, i) => [i + 1, a.matricula, a.nivel, a.cult, a.social, a.dep, a.trasc, a.total]),
      styles: { fontSize: 8 },
    });

    doc.save(`reporte-completo-${Date.now()}.pdf`);
  }

  async generarReporteActividades(data: ReporteActividadesData): Promise<void> {
    const doc = new jsPDF();
    let y = 18;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Actividades', 14, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    y += 6;
    doc.text(`Generado el: ${new Date().toLocaleDateString()} | Total Actividades: ${data.actividades.length}`, 14, y);
    y += 12;

    const imgEjes = await generarGraficoEjes(data.distribucionEjes);
    doc.addImage(imgEjes, 'PNG', 14, y, 85, 60);

    const imgTemporalidad = await generarGraficoTemporalidad(data.distribucionTemporalidad);
    doc.addImage(imgTemporalidad, 'PNG', 105, y, 90, 60);
    y += 68;

    const imgRecientes = await generarGraficoActividadesRecientes(data.actividades);
    doc.addImage(imgRecientes, 'PNG', 14, y, 180, 55);
    y += 63;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Desglose de Registro Histórico', 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [['#', 'ID', 'Título', 'Eje Formativo', 'Temporalidad', 'Puntos TDI', 'Estado']],
      body: data.actividades.map((act, index) => [
        index + 1,
        act.id,
        act.titulo,
        act.eje,
        act.temporalidad,
        act.puntosTdi.toString(),
        act.activa ? 'Activa' : 'Inactiva'
      ]),
      styles: { 
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    doc.save(`reporte-actividades-${Date.now()}.pdf`);
  }
}

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlumnoResumenDTO } from '../models/admin';
import { generarGraficoAlumnosRecientes, generarGraficoNiveles, generarGraficoEjes, generarGraficoActividadesRecientes, generarGraficoTemporalidad } from '../utils/reporte-charts.utils';
import { ActividadDTO } from '../models/actividad';

const EJE_LABEL: Record<string, string> = {
    PERSONAL: 'Personal',
    ENTORNO_SOCIAL: 'Entorno Social',
    DEPORTIVO: 'Deportivo',
    TRASCENDENCIA: 'Trascendencia',
};
export interface ReporteActividadesData {
  actividades: ActividadDTO[];
  distribucionEjes: Record<string, number>;
  distribucionPeriodicidad: Record<string, number>;
}
@Injectable({ providedIn: 'root' })
export class ReporteService {

  async generarReporteAlumnos(
    alumnos: AlumnoResumenDTO[],
    distribucionNiveles: Record<string, number>,
    puntosPorEje: Record<string, number>,
  ): Promise<void> {
    const doc = new jsPDF();
    const altoCabecera = 30;
    doc.setFillColor(7, 23, 40);
    doc.rect(0, 0, 210, altoCabecera, 'F'); 

    let y = 14; 

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('REPORTE DE ALUMNOS', 14, y);

    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('Tokens de Desarrollo Integral', 14, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`FECHA: ${new Date().toLocaleDateString('es-MX')}`, 196, y - 7, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(`Total Registros: ${alumnos.length} alumnos`, 196, y, { align: 'right' });

    y = altoCabecera + 12; 
    doc.setTextColor(15, 23, 42);

    const imgNiveles = await generarGraficoNiveles(distribucionNiveles);
    doc.addImage(imgNiveles, 'PNG', 14, y, 85, 60);
    const imgEjes = await generarGraficoEjes(puntosPorEje);
    doc.addImage(imgEjes, 'PNG', 105, y, 90, 60);
    y += 70;

    const imgRecientes = await generarGraficoAlumnosRecientes(alumnos);
    doc.addImage(imgRecientes, 'PNG', 14, y, 180, 60);
    y += 65;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Alumnos registrados', 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Matrícula', 'Nivel', 'Personal', 'Social', 'Dep.', 'Trasc.', 'Total']],
      body: alumnos.map((a, i) => [i + 1, a.matricula, a.nivel, a.personal, a.social, a.dep, a.trasc, a.total]),
      styles: { fontSize: 8 },
    });

    doc.save(`reporte-alumnos-${Date.now()}.pdf`);
  }

  async generarReporteActividades(data: ReporteActividadesData): Promise<void> {
    const doc = new jsPDF();
    const altoCabecera = 30;
    doc.setFillColor(7, 23, 40);
    doc.rect(0, 0, 210, altoCabecera, 'F'); 

    let y = 14; 

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('REPORTE DE ACTIVIDADES', 14, y);

    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('Tokens de Desarrollo Integral', 14, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`FECHA: ${new Date().toLocaleDateString('es-MX')}`, 196, y - 7, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(`Total Registros: ${data.actividades.length} actividades`, 196, y, { align: 'right' });

    y = altoCabecera + 12; 
    doc.setTextColor(15, 23, 42);

    const imgEjes = await generarGraficoEjes(data.distribucionEjes);
    doc.addImage(imgEjes, 'PNG', 14, y, 85, 60);

    const imgTemporalidad = await generarGraficoTemporalidad(data.distribucionPeriodicidad);
    doc.addImage(imgTemporalidad, 'PNG', 105, y, 90, 60);
    y += 68;

    const imgRecientes = await generarGraficoActividadesRecientes(data.actividades);
    doc.addImage(imgRecientes, 'PNG', 14, y, 180, 55);
    y += 63;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Actividades registradas', 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [['ID', 'Título', 'Eje Formativo', 'Temporalidad', 'Pts', 'Estado']],
      body: data.actividades.map((act, index) => [
        act.id,
        act.titulo,
        EJE_LABEL[act.eje] || act.eje,
        act.periodicidad,
        act.puntosTdi.toString(),
        act.activa ? 'Activa' : 'Inactiva'
      ]),
      styles: { fontSize: 8 },
    });

    doc.save(`reporte-actividades-${Date.now()}.pdf`);
  }
}

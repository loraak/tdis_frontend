import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlumnoResumenDTO } from '../models/admin';
import { generarGraficoAlumnosRecientes, generarGraficoNiveles, generarGraficoEjes, generarGraficoActividadesRecientes, generarGraficoTemporalidad, generarGraficoAreas } from '../utils/reporte-charts.utils';
import { ActividadDTO } from '../models/actividad';
import { filtrarAlumnosEnRiesgo } from '../utils/riesgo.utils';
import { obtenerCuatrimestreActual, Periodo } from '../utils/periodo.utils';
import { calcularAlertasEje } from '../utils/eje.utils';
import { calcularProgresoNivel } from '../utils/nivel.utils';

const EJE_LABEL: Record<string, string> = {
    PERSONAL: 'Personal',
    ENTORNO_SOCIAL: 'Entorno Social',
    DEPORTIVO: 'Deportivo',
    TRASCENDENCIA: 'Trascendencia',
};
const CAMPO_EJE: Record<string, string> = {
  personal: 'Personal',
  social: 'Entorno Social',
  dep: 'Deportivo',
  trasc: 'Trascendencia',
};
export interface ReporteActividadesData {
  actividades: ActividadDTO[];
  distribucionEjes: Record<string, number>;
  distribucionPeriodicidad: Record<string, number>;
  distribucionAreas: Record<string, number>;
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
      body: alumnos.map((a, i) => [i + 1, a.matricula, calcularProgresoNivel(a.total).nivelActual, a.personal, a.social, a.dep, a.trasc, a.total]),
      styles: { fontSize: 8 },
      didParseCell: (data) => {
        if (data.section === 'body') {
          const columnasEje: Record<number, keyof typeof CAMPO_EJE> = {
            4: 'personal', 5: 'social', 6: 'dep', 7: 'trasc',
          };
          const campoEje = columnasEje[data.column.index];
          if (campoEje) {
            const alumno = alumnos[data.row.index];
            const alertas = calcularAlertasEje(alumno);
            console.log('alertas:', alertas);
            const alerta = alertas.find(al => al.eje === CAMPO_EJE[campoEje]);
            if (alerta && !alerta.cumple) {
              data.cell.styles.textColor = [200, 40, 40];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      },
    });
    const finalY = (doc as any).lastAutoTable.finalY + 6;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('*Rojo: eje por debajo del 25% mínimo requerido.', 14, finalY);

    doc.save(`reporte-alumnos-${Date.now()}.pdf`);
  }

  generarReporteRiesgo(alumnos: AlumnoResumenDTO[], cuatrimestre: Periodo): void {
    const enRiesgo = filtrarAlumnosEnRiesgo(alumnos, cuatrimestre);

    const doc = new jsPDF();
    const altoCabecera = 30;
    doc.setFillColor(7, 23, 40);
    doc.rect(0, 0, 210, altoCabecera, 'F'); 

    let y = 14; 

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('REPORTE DE ALUMNOS EN RIESGO', 14, y);

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
    doc.text(`Cuatrimestre: ${cuatrimestre.nombre}${cuatrimestre.esActual ? ' (en curso)' : ' (cerrado)'}`, 196, y, { align: 'right' });

    y = altoCabecera + 12; 
    doc.setTextColor(15, 23, 42);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Alumnos con riesgo Leve o Crítico', 14, 36);
    y += 5;

    if (!enRiesgo.length) {
      doc.setFontSize(11);
      doc.text('No hay alumnos con rezago detectado en este periodo.', 14, 40);
      doc.save(`reporte-riesgo-${cuatrimestre.id}.pdf`);
      return;
    }

    autoTable(doc, {
      startY: 40,
      head: [['Matrícula', 'Alumno', 'TDI\'s actuales', 'TDI\'s esperados', 'Diferencia', 'Riesgo']],
      body: enRiesgo.map(a => [
        a.matricula, `${a.nombre} ${a.apellidos}`, a.total, a.puntosEsperados, a.diferencia,
        a.nivelRiesgo === 'critico' ? 'Crítico' : 'Leve',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 65, 85] },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          const riesgo = enRiesgo[data.row.index].nivelRiesgo;
          data.cell.styles.textColor = riesgo === 'critico' ? [200, 40, 40] : [200, 140, 20];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    doc.save(`reporte-riesgo-${cuatrimestre.id}.pdf`);
  }

  async generarReporteActividades(data: ReporteActividadesData): Promise<void> {
    const doc = new jsPDF();
    const altoCabecera = 30;
    
    const dibujarCabecera = () => {
      doc.setFillColor(7, 23, 40);
      doc.rect(0, 0, 210, altoCabecera, 'F'); 

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('REPORTE DE ACTIVIDADES', 14, 14);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text('Tokens de Desarrollo Integral', 14, 21);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`FECHA: ${new Date().toLocaleDateString('es-MX')}`, 196, 14, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`Total Registros: ${data.actividades.length} actividades`, 196, 21, { align: 'right' });
    };

    let y = altoCabecera + 12; 

    const imgEjes = await generarGraficoEjes(data.distribucionEjes);
    doc.addImage(imgEjes, 'PNG', 14, y, 85, 70);

    const imgTemporalidad = await generarGraficoTemporalidad(data.distribucionPeriodicidad);
    doc.addImage(imgTemporalidad, 'PNG', 105, y, 90, 70);
    y += 72;

    const imgRecientes = await generarGraficoActividadesRecientes(data.actividades);
    doc.addImage(imgRecientes, 'PNG', 14, y, 180, 74);
    y += 78;

    const imgAreas = await generarGraficoAreas(data.distribucionAreas);
    doc.addImage(imgAreas, 'PNG', 55, y, 100, 74);
    y += 90;

    doc.addPage();
    y = altoCabecera + 12;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Actividades registradas', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { top: altoCabecera + 12 },
      head: [['ID', 'Título', 'Eje Formativo', 'Temporalidad', "TDI's", 'Estado']],
      body: data.actividades.map((act) => [
        act.id,
        act.titulo,
        EJE_LABEL[act.eje] || act.eje,
        act.periodicidad,
        act.puntosTdi.toString(),
        act.activa ? 'Activa' : 'Inactiva'
      ]),
      styles: { fontSize: 8 },
    });

    const totalPaginas = doc.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      dibujarCabecera();
    }

    doc.save(`reporte-actividades-${Date.now()}.pdf`);
  }
}

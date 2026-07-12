import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlumnoResumenDTO } from '../models/admin';
import { generarGraficoAlumnosRecientes, generarGraficoNiveles, generarGraficoEjes } from '../utils/reporte-charts.utils';

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

}

import { Periodo } from './periodo.utils';
import { PUNTOS_MAXIMOS } from '../models/nivel';
import { AlumnoResumenDTO } from '../models/admin';

export interface AlumnoRiesgo extends AlumnoResumenDTO {
    puntosEsperados: number;
    diferencia: number;
    porcentajeAvance: number;
    nivelRiesgo: 'ok' | 'leve' | 'critico';
}

const DIAS_GRACIA = 14;

export function calcularRiesgo(
    alumno: AlumnoResumenDTO,
    cuatrimestre: Periodo,
    hoy = new Date()
): AlumnoRiesgo {
    const fechaCorte = cuatrimestre.fin < hoy ? cuatrimestre.fin : hoy;

    const inicioReal = new Date(
        Math.max(new Date(alumno.createdAt).getTime(), cuatrimestre.inicio.getTime())
    );

    const diasDesdeInicio = Math.floor((fechaCorte.getTime() - inicioReal.getTime()) / 86_400_000);
    if (diasDesdeInicio < DIAS_GRACIA) {
        return { ...alumno, puntosEsperados: 0, diferencia: 0, porcentajeAvance: 100, nivelRiesgo: 'ok' };
    }

    const totalDias = Math.floor((cuatrimestre.fin.getTime() - cuatrimestre.inicio.getTime()) / 86_400_000);
    const diasTranscurridos = Math.floor((fechaCorte.getTime() - cuatrimestre.inicio.getTime()) / 86_400_000);
    const fraccion = Math.min(1, Math.max(0, diasTranscurridos / totalDias));

    const puntosEsperados = Math.round(PUNTOS_MAXIMOS * fraccion);
    const diferencia = alumno.total - puntosEsperados;
    const porcentajeAvance = puntosEsperados > 0 ? (alumno.total / puntosEsperados) * 100 : 100;

    let nivelRiesgo: AlumnoRiesgo['nivelRiesgo'] = 'ok';
    if (porcentajeAvance < 50) nivelRiesgo = 'critico';
    else if (porcentajeAvance < 80) nivelRiesgo = 'leve';

    return { ...alumno, puntosEsperados, diferencia, porcentajeAvance, nivelRiesgo };
}

export function filtrarAlumnosEnRiesgo(
    alumnos: AlumnoResumenDTO[],
    cuatrimestre: Periodo,
    hoy = new Date()
): AlumnoRiesgo[] {
    return alumnos
        .filter(a => new Date(a.createdAt) <= cuatrimestre.fin)
        .map(a => calcularRiesgo(a, cuatrimestre, hoy))
        .filter(a => a.nivelRiesgo !== 'ok');
}
import { NIVELES, NivelDef, PUNTOS_MAXIMOS } from '../models/nivel';

export interface ProgresoNivel {
    nivelActual: string;
    siguienteNivel: string | null;
    puntosFaltantes: number;
    porcentaje: number;
    graduado: boolean;
}

export function calcularProgresoNivel(totalPuntos: number): ProgresoNivel {
    const ordenados = [...NIVELES].sort((a, b) => a.minPuntos - b.minPuntos);

    let actual = ordenados[0];
    let siguiente: (typeof ordenados)[0] | null = null;

    for (let i = 0; i < ordenados.length; i++) {
        if (totalPuntos >= ordenados[i].minPuntos) {
            actual = ordenados[i];
            siguiente = ordenados[i + 1] ?? null;
        }
    }

    const graduado = totalPuntos >= PUNTOS_MAXIMOS;

    const topeSiguiente = siguiente ? siguiente.minPuntos : PUNTOS_MAXIMOS;
    const rango = topeSiguiente - actual.minPuntos;
    const avance = totalPuntos - actual.minPuntos;
    const porcentaje = graduado ? 100 : Math.min(100, Math.max(0, (avance / rango) * 100));

    return {
        nivelActual: actual.nombre,
        siguienteNivel: siguiente?.nombre ?? (graduado ? null : 'Nivel máximo'),
        puntosFaltantes: Math.max(0, topeSiguiente - totalPuntos),
        porcentaje,
        graduado,
    };
}
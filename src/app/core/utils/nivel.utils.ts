import { NIVELES, NivelDef } from '../models/nivel';

export interface ProgresoNivel {
    nivelActual: string;
    siguienteNivel: string | null;
    puntosFaltantes: number;
    porcentaje: number;
}

export function calcularProgresoNivel(totalPuntos: number): ProgresoNivel {
    const ordenados = [...NIVELES].sort((a, b) => a.minPuntos - b.minPuntos);

    let actual = ordenados[0];
    let siguiente: NivelDef | null = null;

    for (let i = 0; i < ordenados.length; i++) {
        if (totalPuntos >= ordenados[i].minPuntos) {
            actual = ordenados[i];
            siguiente = ordenados[i + 1] ?? null;
        }
    }

    if (!siguiente) {
        return { nivelActual: actual.nombre, siguienteNivel: null, puntosFaltantes: 0, porcentaje: 100 };
    }

    const rango = siguiente.minPuntos - actual.minPuntos;
    const avance = totalPuntos - actual.minPuntos;
    const porcentaje = Math.min(100, Math.max(0, (avance / rango) * 100));

    return {
        nivelActual: actual.nombre,
        siguienteNivel: siguiente.nombre,
        puntosFaltantes: siguiente.minPuntos - totalPuntos,
        porcentaje,
    };
}
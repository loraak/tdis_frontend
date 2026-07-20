export interface AlertaEje {
    eje: string;
    puntos: number;
    porcentaje: number;
    cumple: boolean;
}

const UMBRAL_MINIMO = 0.25;

export function calcularAlertasEje(alumno: {
    personal: number; social: number; dep: number; trasc: number; total: number;
}): AlertaEje[] {
    const ejes = [
        { eje: 'Personal', puntos: alumno.personal },
        { eje: 'Entorno Social', puntos: alumno.social },
        { eje: 'Deportivo', puntos: alumno.dep },
        { eje: 'Trascendencia', puntos: alumno.trasc },
    ];

    if (alumno.total === 0) {
        return ejes.map(e => ({ ...e, porcentaje: 0, cumple: true }));
    }

    return ejes.map(e => {
        const porcentaje = e.puntos / alumno.total;
        return { ...e, porcentaje, cumple: porcentaje >= UMBRAL_MINIMO };
    });
}
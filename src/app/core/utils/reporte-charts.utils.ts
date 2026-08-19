import { ChartConfiguration } from 'chart.js/auto';
import { generarImagenGrafico } from './chart-image.utils';
import { NIVEL_COLOR } from '../models/nivel';

const EJE_COLOR: Record<string, string> = {
    PERSONAL: '#0369a1',
    ENTORNO_SOCIAL: '#16a34a',
    DEPORTIVO: '#f59e0b',
    TRASCENDENCIA: '#8b5cf6',
};

const EJE_LABEL: Record<string, string> = {
    PERSONAL: 'Identidad Personal',
    ENTORNO_SOCIAL: 'Entorno Social',
    DEPORTIVO: 'Físico',
    TRASCENDENCIA: 'Trascendencia',
};

export const DIVISION_LABEL: Record<string, string> = {
    'TECNOLOGIAS': 'Tecnologías de la Info.',
    'IDIOMAS': 'Idiomas',
    'ECONOMICO_ADMINISTRATIVA': 'Económico-Admin.',
    'INDUSTRIAL_Y_NANOTECNOLOGIA': 'Industrial y Nano.',
    'SIN_DIVISION': 'Sin División'
};

export const DIVISION_COLOR: Record<string, string> = {
    'TECNOLOGIAS': '#2563EB',
    'IDIOMAS': '#10B981',
    'ECONOMICO_ADMINISTRATIVA': '#F59E0B',
    'INDUSTRIAL_Y_NANOTECNOLOGIA': '#EC4899',
    'SIN_DIVISION': '#6B7280'
};

export async function generarGraficoNiveles(distribucion: Record<string, number>): Promise<string> {
    const labels = Object.keys(distribucion);
    const data = Object.values(distribucion);
    const colors = labels.map(l => NIVEL_COLOR[l] || '#999');

    const config: ChartConfiguration = {
        type: 'pie',
        data: {
            labels,
            datasets: [{ data, backgroundColor: colors, borderWidth: 1, borderColor: '#fff' }],
        },
        options: {
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 } } },
                title: { display: true, text: 'Alumnos por nivel', font: { size: 13 } },
            },
        },
    };

    return generarImagenGrafico(config);
}


export async function generarGraficoEjes(puntosPorEje: Record<string, number>): Promise<string> {
    const keys = Object.keys(puntosPorEje);
    const labels = keys.map(k => EJE_LABEL[k] ?? k);
    const data = keys.map(k => puntosPorEje[k]);
    const colors = keys.map(k => EJE_COLOR[k] ?? '#888');

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: colors, borderRadius: 4 }],
        },
        options: {
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Puntos totales por eje', font: { size: 13 } },
            },
            scales: { y: { beginAtZero: true } },
        },
    };

    return generarImagenGrafico(config);
}

export async function generarGraficoAlumnosRecientes(
    alumnos: { createdAt: Date | string }[],
    semanas = 8
): Promise<string> {
    const hoy = new Date();

    const inicioSemanaActual = new Date(hoy);
    const diaSemana = inicioSemanaActual.getDay();
    const diffAlLunes = inicioSemanaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    inicioSemanaActual.setDate(diffAlLunes);
    inicioSemanaActual.setHours(0, 0, 0, 0);

    const buckets: Record<string, number> = {};
    const labelsPorKey: Record<string, string> = {};
    const keys: string[] = [];

    const obtenerKeySemana = (d: Date): string => {
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };

    for (let i = semanas - 1; i >= 0; i--) {
        const lunesSemana = new Date(inicioSemanaActual);
        lunesSemana.setDate(lunesSemana.getDate() - i * 7);

        const key = obtenerKeySemana(lunesSemana);
        buckets[key] = 0;
        keys.push(key);

        const fechaInicioStr = lunesSemana.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
        labelsPorKey[key] = `Sem. ${fechaInicioStr}`;
    }

    alumnos.forEach(a => {
        const fecha = new Date(a.createdAt);
        const lunesActividad = new Date(fecha);
        const dia = lunesActividad.getDay();
        const diff = lunesActividad.getDate() - dia + (dia === 0 ? -6 : 1);
        lunesActividad.setDate(diff);
        lunesActividad.setHours(0, 0, 0, 0);

        const key = obtenerKeySemana(lunesActividad);
        if (key in buckets) {
            buckets[key]++;
        }
    });

    const labels = keys.map(k => labelsPorKey[k]);
    const data = keys.map(k => buckets[k]);

    const maxData = Math.max(...data, 0);
    const step = maxData > 0 ? Math.ceil(maxData / 5) : 1;

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: '#378ADD', borderRadius: 3, maxBarThickness: 28 }],
        },
        options: {
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Alumnos nuevos por semana (últimas ${semanas} semanas)`, font: { size: 13 } },
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: Math.max(1, Math.ceil(Math.max(...data) / 5)) } },
                x: {
                    ticks: {
                        callback: (val, index) => (index % step === 0 ? labels[index] : ''),
                        maxRotation: 0,
                        font: { size: 9 },
                    },
                },
            },
        },
    };

    return generarImagenGrafico(config, 900, 300);
}

export async function generarGraficoTemporalidad(distribucionTemporalidad: Record<string, number>): Promise<string> {
    const keys = Object.keys(distribucionTemporalidad);
    const labels = keys.map(k => EJE_LABEL[k] ?? k);
    const data = keys.map(k => distribucionTemporalidad[k]);
    const colors = keys.map(k => EJE_COLOR[k] ?? '#888');

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: colors, borderRadius: 4 }],
        },
        options: {
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Puntos totales por eje', font: { size: 13 } },
            },
            scales: { y: { beginAtZero: true } },
        },
    };

    return generarImagenGrafico(config);
}

export async function generarGraficoAreas(distribucion: Record<string, number>): Promise<string> {
    const labels = Object.keys(distribucion);
    const data = Object.values(distribucion);

    const config: ChartConfiguration = {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#378ADD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
            }]
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                title: { display: true, text: 'Distribución por Área', font: { size: 13 } },
                legend: { position: 'bottom' }
            }
        }
    };

    return generarImagenGrafico(config, 400, 300);
}

export async function generarGraficoDivisiones(
    distribucionDivisiones: Record<string, number>
): Promise<string> {
    const keys = Object.keys(distribucionDivisiones);
    const labels = keys.map(k => DIVISION_LABEL[k] ?? k);
    const data = keys.map(k => distribucionDivisiones[k]);
    const colors = keys.map(k => DIVISION_COLOR[k] ?? '#888888');

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors,
                    borderRadius: 4
                }
            ]
        },
        options: {
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Distribución de alumnos por división',
                    font: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    return generarImagenGrafico(config);
}

export async function generarGraficoActividadesRecientes(
    actividades: { createdAt: Date | string }[],
    semanas = 8
): Promise<string> {
    const hoy = new Date();

    const inicioSemanaActual = new Date(hoy);
    const diaSemana = inicioSemanaActual.getDay();
    const diffAlLunes = inicioSemanaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    inicioSemanaActual.setDate(diffAlLunes);
    inicioSemanaActual.setHours(0, 0, 0, 0);

    const buckets: Record<string, number> = {};
    const labelsPorKey: Record<string, string> = {};
    const keys: string[] = [];

    const obtenerKeySemana = (d: Date): string => {
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };

    for (let i = semanas - 1; i >= 0; i--) {
        const lunesSemana = new Date(inicioSemanaActual);
        lunesSemana.setDate(lunesSemana.getDate() - i * 7);

        const key = obtenerKeySemana(lunesSemana);
        buckets[key] = 0;
        keys.push(key);

        const fechaInicioStr = lunesSemana.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
        labelsPorKey[key] = `Sem. ${fechaInicioStr}`;
    }

    actividades.forEach(a => {
        const fecha = new Date(a.createdAt);
        const lunesActividad = new Date(fecha);
        const dia = lunesActividad.getDay();
        const diff = lunesActividad.getDate() - dia + (dia === 0 ? -6 : 1);
        lunesActividad.setDate(diff);
        lunesActividad.setHours(0, 0, 0, 0);

        const key = obtenerKeySemana(lunesActividad);
        if (key in buckets) {
            buckets[key]++;
        }
    });

    const labels = keys.map(k => labelsPorKey[k]);
    const data = keys.map(k => buckets[k]);

    const maxData = Math.max(...data, 0);
    const step = maxData > 0 ? Math.ceil(maxData / 5) : 1;

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: '#378ADD', borderRadius: 3, maxBarThickness: 36 }],
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Actividades nuevas por semana (últimas ${semanas} semanas)`, font: { size: 13 } },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: step }
                },
                x: {
                    ticks: {
                        maxRotation: 0,
                        font: { size: 10 },
                    },
                },
            },
        },
    };

    return generarImagenGrafico(config, 900, 300);
}

import { ChartConfiguration } from 'chart.js/auto';
//import { generarImagenGrafico } from './chart-image.utils';
import { NIVEL_COLOR } from '../models/nivel';

const EJE_COLOR: Record<string, string> = {
    PERSONAL: '#0369a1',
    ENTORNO_SOCIAL: '#16a34a',
    DEPORTIVO: '#f59e0b',
    TRASCENDENCIA: '#8b5cf6',
};

const EJE_LABEL: Record<string, string> = {
    PERSONAL: 'Personal',
    ENTORNO_SOCIAL: 'Entorno Social',
    DEPORTIVO: 'Deportivo',
    TRASCENDENCIA: 'Trascendencia',
};

/*
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
    dias = 14
): Promise<string> {
    const hoy = new Date();
    const buckets: Record<string, number> = {};
    const labelsPorKey: Record<string, string> = {};

    for (let i = dias - 1; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets[key] = 0;
        labelsPorKey[key] = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    }

    alumnos.forEach(a => {
        const fecha = new Date(a.createdAt);
        const key = fecha.toISOString().slice(0, 10);
        if (key in buckets) buckets[key]++;
    });

    const keys = Object.keys(buckets);
    const labels = keys.map(k => labelsPorKey[k]);
    const data = keys.map(k => buckets[k]);

    const maxLabelsVisibles = 10;
    const paso = Math.ceil(dias / maxLabelsVisibles);

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: '#378ADD', borderRadius: 3, maxBarThickness: 28 }],
        },
        options: {
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Alumnos nuevos (últimos ${dias} días)`, font: { size: 13 } },
            },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: Math.max(1, Math.ceil(Math.max(...data) / 5)) } },
                x: {
                    ticks: {
                        callback: (val, index) => (index % paso === 0 ? labels[index] : ''),
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

export async function generarGraficoActividadesRecientes(
    actividades: { createdAt: Date | string }[],
    dias = 14
): Promise<string> {
    const hoy = new Date();
    const buckets: Record<string, number> = {};
    const labelsPorKey: Record<string, string> = {};

    const obtenerKeyLocal = (d: Date): string => {
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    };

    for (let i = dias - 1; i >= 0; i--) {
        const d = new Date(hoy);
        d.setDate(d.getDate() - i);
        const key = obtenerKeyLocal(d);
        buckets[key] = 0;
        labelsPorKey[key] = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    }

    actividades.forEach(a => {
        const fecha = new Date(a.createdAt);
        const key = obtenerKeyLocal(fecha);
        if (key in buckets) {
            buckets[key]++;
        }
    });

    const keys = Object.keys(buckets);
    const labels = keys.map(k => labelsPorKey[k]);
    const data = keys.map(k => buckets[k]);
    const maxLabelsVisibles = 10;
    const paso = Math.ceil(dias / maxLabelsVisibles);
    const maxData = Math.max(...data);
    const step = maxData > 0 ? Math.ceil(maxData / 5) : 1;

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets: [{ data, backgroundColor: '#378ADD', borderRadius: 3, maxBarThickness: 28 }],
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Actividades nuevas (últimos ${dias} días)`, font: { size: 13 } },
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { stepSize: step } 
                },
                x: {
                    ticks: {
                        callback: (val, index) => (index % paso === 0 ? labels[index] : ''),
                        maxRotation: 0,
                        font: { size: 9 },
                    },
                },
            },
        },
    };

    return generarImagenGrafico(config, 900, 300);
}*/
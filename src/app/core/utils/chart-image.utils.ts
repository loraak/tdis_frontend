import { Chart, ChartConfiguration } from 'chart.js/auto';

export async function generarImagenGrafico(
    config: ChartConfiguration,
    width = 400,
    height = 260
): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'fixed';
    canvas.style.left = '-9999px';
    document.body.appendChild(canvas);

    config.options = {
        ...config.options,
        responsive: false,
        animation: false,
    };

    const chart = new Chart(canvas, config);

    await new Promise(resolve => requestAnimationFrame(resolve));

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    chart.destroy();
    document.body.removeChild(canvas);

    return dataUrl;
}
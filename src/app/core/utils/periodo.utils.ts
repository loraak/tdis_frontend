export interface Periodo {
    id: string;
    inicio: Date;
    fin: Date;
    nombre: string;
    esActual: boolean;
}

function construirCuatrimestre(anio: number, indice: 0 | 1 | 2, hoy: Date): Periodo {
    const rangos = [
        { inicio: [0, 1], fin: [3, 30], nombre: 'Enero–Abril' },
        { inicio: [4, 1], fin: [7, 31], nombre: 'Mayo–Agosto' },
        { inicio: [8, 1], fin: [11, 31], nombre: 'Septiembre–Diciembre' },
    ][indice];

    const inicio = new Date(anio, rangos.inicio[0], rangos.inicio[1]);
    const fin = new Date(anio, rangos.fin[0], rangos.fin[1]);

    return {
        id: `${anio}-${indice}`,
        inicio,
        fin,
        nombre: `${rangos.nombre} ${anio}`,
        esActual: hoy >= inicio && hoy <= fin,
    };
}

export function obtenerCuatrimestreActual(hoy = new Date()): Periodo {
    const mes = hoy.getMonth();
    const indice = mes <= 3 ? 0 : mes <= 7 ? 1 : 2;
    return construirCuatrimestre(hoy.getFullYear(), indice, hoy);
}

export function listarCuatrimestres(cantidad = 6, hoy = new Date()): Periodo[] {
    const lista: Periodo[] = [];
    let anio = hoy.getFullYear();
    let indice = hoy.getMonth() <= 3 ? 0 : hoy.getMonth() <= 7 ? 1 : 2;

    for (let i = 0; i < cantidad; i++) {
        lista.push(construirCuatrimestre(anio, indice as 0 | 1 | 2, hoy));
        indice--;
        if (indice < 0) { indice = 2; anio--; }
    }

    return lista;
}
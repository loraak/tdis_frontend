export interface NivelDef {
    nombre: string;
    minPuntos: number;
    icon: string;
}

export const PUNTOS_MAXIMOS = 65;
export const NIVELES: NivelDef[] = [
    { nombre: 'EXPLORADOR', minPuntos: 0,   icon: 'fa-solid fa-leaf' },
    { nombre: 'PROMOTOR',   minPuntos: 21,  icon: 'pi pi-bolt' },
    { nombre: 'LÍDER',      minPuntos: 42, icon: 'pi pi-check-circle' },
    { nombre: 'EMBAJADOR',  minPuntos: 65, icon: 'pi pi-trophy' },
];

export const NIVEL_COLOR: Record<string, string> = {
    'Explorador': '#00bcd4',
    'Promotor':    '#f59e0b',
    'Líder':       '#8b5cf6',
    'Embajador':   '#22c55e',
};
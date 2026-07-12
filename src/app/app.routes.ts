import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { NuevaSolicitud } from './alumno/nueva-solicitud/nueva-solicitud';
import { MisSolicitudes } from './alumno/mis-solicitudes/mis-solicitudes';
import { Catalogo } from './shared/components/catalogo/catalogo';
import { Resumen } from './admin/resumen/resumen';
import { Alumnos } from './admin/alumnos/alumnos';
import { Solicitudes } from './admin/solicitudes/solicitudes';
import { Actividad } from './solicitante/actividad/actividad';
import { Actividades } from './solicitante/actividades/actividades';
import { authGuard } from './core/guards/auth.guard';
import { ProgresoAlumno } from './shared/components/progreso-alumno/progreso-alumno';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'alumno', component: MainLayout, canActivate: [authGuard], data: {role: 'alumno'}, children: [
        { path: 'progreso',    component: ProgresoAlumno },
        { path: 'nueva-solicitud',   component: NuevaSolicitud },
        { path: 'mis-solicitudes', component: MisSolicitudes },
        { path: 'catalogo',    component: Catalogo },
        { path: '', redirectTo: 'progreso', pathMatch: 'full' }
    ]},
    {path: 'admin', component: MainLayout, canActivate: [authGuard], data: {role: 'admin'}, children: [
        { path: 'resumen',     component: Resumen },
        { path: 'alumnos',     component: Alumnos },
        { path: 'solicitudes', component: Solicitudes },
        { path: 'catalogo',    component: Catalogo },
        { path: '', redirectTo: 'resumen', pathMatch: 'full' }
    ]},
    {path: 'solicitante', component: MainLayout, canActivate: [authGuard], data: {role: 'solicitante'}, children: [
        { path: 'nueva-actividad', component: Actividad },
        { path: 'mis-actividades', component: Actividades },
        { path: 'catalogo',    component: Catalogo },
        { path: '', redirectTo: 'mis-solicitudes', pathMatch: 'full' }
    ]},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { MiProgreso } from './alumno/mi-progreso/mi-progreso';
import { NuevaSolicitud } from './alumno/nueva-solicitud/nueva-solicitud';
import { MisSolicitudes } from './alumno/mis-solicitudes/mis-solicitudes';
import { Catalogo } from './shared/components/catalogo/catalogo';
import { Resumen } from './admin/resumen/resumen';
import { Alumnos } from './admin/alumnos/alumnos';
import { Solicitudes } from './admin/solicitudes/solicitudes';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'alumno', component: MainLayout, canActivate: [authGuard], data: {role: 'alumno'}, children: [
        { path: 'progreso',    component: MiProgreso },
        { path: 'solicitud',   component: NuevaSolicitud },
        { path: 'solicitudes', component: MisSolicitudes },
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
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

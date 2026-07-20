import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { RegisterExterno } from './auth/register-externo/register-externo';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { NuevaSolicitud } from './alumno/nueva-solicitud/nueva-solicitud';
import { MisSolicitudes } from './alumno/mis-solicitudes/mis-solicitudes';
import { Catalogo } from './shared/components/catalogo/catalogo';
import { Resumen } from './admin/resumen/resumen';
import { Alumnos } from './admin/alumnos/alumnos';
import { Solicitudes } from './admin/solicitudes/solicitudes';
import { AdminCatalogo } from './admin/catalogo/catalogo';
import { Actividad } from './crea-actividades/actividad/actividad';
import { Actividades } from './crea-actividades/actividades/actividades';
import { authGuard } from './core/guards/auth.guard';
import { ProgresoAlumno } from './shared/components/progreso-alumno/progreso-alumno';
import { RevisionActividad } from './admin/revision-actividad/revision-actividad';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'register-externo', component: RegisterExterno},
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
        { path: 'revision-actividades', component: RevisionActividad},
        { path: 'catalogo',    component: AdminCatalogo },
        { path: '', redirectTo: 'resumen', pathMatch: 'full' }
    ]},
    {path: 'externo', component: MainLayout, canActivate: [authGuard], data: {role: 'externo'}, children: [
        { path: 'nueva-actividad', component: Actividad },
        { path: 'mis-actividades', component: Actividades },
        { path: 'catalogo',    component: AdminCatalogo },
        { path: '', redirectTo: 'catalogo', pathMatch: 'full' }
    ]},
    {path: 'interno', component: MainLayout, canActivate: [authGuard], data: {role: 'interno'}, children: [
        { path: 'nueva-actividad', component: Actividad },
        { path: 'mis-actividades', component: Actividades },
        { path: 'catalogo',    component: Catalogo },
        { path: '', redirectTo: 'catalogo', pathMatch: 'full' }
    ]},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

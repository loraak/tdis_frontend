import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

// Página de inicio de cada tipo de usuario
const INICIO_POR_ROL: Record<string, string> = {
  ADMINISTRADOR: '/admin/resumen',
  ALUMNO: '/alumno/progreso',
  INTERNO: '/interno/mis-actividades',
  EXTERNO: '/externo/mis-actividades',
};

// Qué tipo de usuario puede entrar a cada sección
// (la clave es el "data: { role: ... }" que está en app.routes.ts)
const ROL_REQUERIDO: Record<string, string> = {
  admin: 'ADMINISTRADOR',
  alumno: 'ALUMNO',
  interno: 'INTERNO',
  externo: 'EXTERNO',
};

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // 1) Si no ha iniciado sesión, al login
  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // 2) Si la sección no es para su tipo de usuario, lo mandamos a su inicio
  const tipoUsuario = auth.rol(); // 'ALUMNO', 'ADMINISTRADOR', 'INTERNO' o 'EXTERNO'
  const requerido = ROL_REQUERIDO[route.data?.['role']];

  if (requerido && tipoUsuario !== requerido) {
    const inicio = tipoUsuario ? INICIO_POR_ROL[tipoUsuario] : undefined;
    return router.createUrlTree([inicio ?? '/login']);
  }

  // 3) Todo bien, puede pasar
  return true;
};

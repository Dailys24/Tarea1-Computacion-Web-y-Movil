import type { Usuario, TipoUsuario } from "../../db/dbUsuers.ts";

export interface SesionActiva {
  userId: number;
  email: string;
  rol: TipoUsuario;
  inicio: string; // ISO 8601
}

// Mapa token -> datos de sesión. Vive sólo en memoria del proceso.
const sesionesActivas: Record<string, SesionActiva> = {};

// Genera un token "razonablemente único" combinando random + timestamp.
function generarToken(): string {
  return (
    "tkn_" +
    Math.random().toString(36).substring(2, 15) +
    Date.now().toString(36)
  );
}

export function crearSesion(usuario: Usuario): string {
  const token = generarToken();
  sesionesActivas[token] = {
    userId: usuario.id,
    email: usuario.email,
    rol: usuario.tipo,
    inicio: new Date().toISOString(),
  };
  return token;
}

export function obtenerSesion(token: string): SesionActiva | null {
  return sesionesActivas[token] ?? null;
}

export function cerrarSesion(token: string): boolean {
  if (sesionesActivas[token]) {
    delete sesionesActivas[token];
    return true;
  }
  return false;
}

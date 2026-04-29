// src/utilidades/validaciones.ts
import type {InterfaceCB} from "../utils/interfaces/interfaces.ts";

export function validarCredito(numero: string, cvv: string): InterfaceCB {
  // ... código existente anterior ...
  if (numero.length !== 16 || !/^\d+$/.test(numero)) {
    return { ok: false, msg: "Número de tarjeta inválido", data: null };
  }
  if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
    return { ok: false, msg: "CVV inválido", data: null };
  }
  return { ok: true, msg: "Tarjeta válida", data: null };
}


export function validarEmail(email: unknown): boolean {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarPassword(password: unknown): boolean {
    return typeof password === 'string' && password.length >= 8;
}

export function validarRut(rut: unknown): boolean {
    if (typeof rut !== 'string') return false;
    
    const rutLimpio = rut.replace(/[.\-]/g, '').trim().toUpperCase();
    if (!/^\d+[0-9K]$/.test(rutLimpio)) return false;

    let suma = 0;
    let multiplicador = 2;
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplicador;
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvCalculado;
}

export function validarNombre(nombre: unknown): boolean {
    if (typeof nombre !== 'string') return false;

    const nombreLimpio = nombre.trim();
    // Requiere al menos 3 caracteres efectivos y sólo letras reales con espacios internos
    return nombreLimpio.length >= 3 && /^[\p{L}]+(?:\s+[\p{L}]+)*$/u.test(nombreLimpio);
}

export function validarTelefono(telefono: unknown): boolean {
    if (typeof telefono !== 'string') return false;

    const telefonoLimpio = telefono.trim();
    // Requiere al menos 9 caracteres efectivos y sólo dígitos
    return telefonoLimpio.length >= 9 && /^\d+$/.test(telefonoLimpio);
}
// src/utilidades/validaciones.ts

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
    // Requiere al menos 3 caracteres efectivos, ignorando espacios al inicio y al final
    return typeof nombre === 'string' && nombre.trim().length >= 3;
}

export function validarTelefono(telefono: unknown): boolean {
    // Requiere al menos 9 caracteres efectivos, ignorando espacios al inicio y al final
    return typeof telefono === 'string' && telefono.trim().length >= 9;
}
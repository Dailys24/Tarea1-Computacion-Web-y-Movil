// src/utilidades/validaciones.js

function validarEmail(email) {
    if (typeof email !== 'string') return false;
    // Validación asistida por copilot
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarPassword(password) {
    return typeof password === 'string' && password.length >= 8;
}

function validarRut(rut) {
    if (typeof rut !== 'string') return false;
    
    // 1. Limpiamos puntos y guiones
    const rutLimpio = rut.replace(/[.\-]/g, '').trim().toUpperCase();
    if (!/^\d+[0-9K]$/.test(rutLimpio)) return false;

    // 2. Cálculo matemático  dígito verificador en chile
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
        suma += parseInt(cuerpo[i], 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = '';

    if (resto === 11) dvEsperado = '0';
    else if (resto === 10) dvEsperado = 'K';
    else dvEsperado = String(resto);

    return dv === dvEsperado;
}

function validarNombre(nombre) {
    if (typeof nombre !== 'string') return false;
    const nombreLimpio = nombre.trim();
    // Exigir que tenga al menos 3 letras reales (no números ni espacios)
    const letras = nombreLimpio.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g);
    return letras !== null && letras.length >= 3;
}

function validarTelefono(telefono) {
    // Exigir que sean solo números y al menos 9
    return typeof telefono === 'string' && /^\d{9,}$/.test(telefono);
}


module.exports = {
    validarEmail,
    validarPassword,
    validarRut,
    validarNombre,
    validarTelefono
};
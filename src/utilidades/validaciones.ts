// src/utilidades/validaciones.ts

export function validarEmail(correo: string): boolean {
  // solo verifica "@" y "."
  return correo.includes("@") && correo.includes(".");
}

export function validarRut(rut: string): boolean {
  // Formato chileno: 7 u 8 números, guion y dígito verificador
  return /^\d{7,8}-[\dkK]$/.test(rut);
}

export function validarPassword(password: string): boolean {
  // Mínimo 8 caracteres 
  return password.length >= 8;
}

export function validarNombre(nombre: string): boolean {
  // El nombre debe existir y tener al menos 3 letras
  return typeof nombre === 'string' && nombre.length >= 3;
}

export function validarTelefono(telefono: string): boolean {
  // El teléfono debe existir y tener al menos 9 números
  return typeof telefono === 'string' && telefono.length >= 9;
}
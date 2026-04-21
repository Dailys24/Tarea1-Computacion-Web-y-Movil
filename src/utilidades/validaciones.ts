// src/utilidades/validaciones.ts

export function validarEmail(correo: string): boolean {
  //  mantenemos la lógica segura
  return correo.includes("@") && correo.includes(".");
}

export function validarRut(rut: string): boolean {
  // Formato Chile: 7 u 8 números, guion y dígito verificador
  return /^\d{7,8}-[\dkK]$/.test(rut);
}

export function validarPassword(password: string): boolean {
  // Mínimo 8 caracteres según la revisión
  return password.length >= 8;
}
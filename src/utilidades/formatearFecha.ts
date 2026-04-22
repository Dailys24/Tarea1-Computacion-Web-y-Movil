// src/utilidades/formatearFecha.ts

/** * Constante para centralizar el mensaje de error y facilitar cambios futuros.
 */
const FECHA_INVALIDA = 'Fecha inválida';

/** * Regex para validar strings en formato ISO 8601 completo.
 */
const REGEX_FECHA_ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+\-]\d{2}:\d{2})$/;

/**
 * Formatea una fecha a formato DD/MM/YYYY.
 * Esta función renderiza la fecha utilizando la zona horaria local */
export function formatearFecha(fecha: string | Date | null | undefined, incluirHora: boolean = false): string {
  if (fecha === null || fecha === undefined) {
    return FECHA_INVALIDA;
  }

  let d: Date;
// Manejo de diferentes tipos de entrada para la fecha
  if (fecha instanceof Date) {
    d = fecha;
  } else if (typeof fecha === 'string') {
    // Normalizamos el string eliminando espacios en blanco innecesarios
    const fechaLimpia = fecha.trim();
    
    if (fechaLimpia === '') {
      return FECHA_INVALIDA;
    }

    // Caso 1: Formato simple YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
      const partes = fechaLimpia.split('-');
      const anioLocal = parseInt(partes[0], 10);
      const mesLocal = parseInt(partes[1], 10);
      const diaLocal = parseInt(partes[2], 10);
      
      d = new Date(anioLocal, mesLocal - 1, diaLocal);

      // Validación de consistencia para evitar fechas inexistentes (ej. 31 de junio)
      if (d.getFullYear() !== anioLocal || d.getMonth() !== mesLocal - 1 || d.getDate() !== diaLocal) {
        return FECHA_INVALIDA;
      }
    } 
    // Caso 2: Formato ISO 8601 con zona horaria
    else if (REGEX_FECHA_ISO_8601.test(fechaLimpia)) {
      d = new Date(fechaLimpia);
    } 
    else {
      return FECHA_INVALIDA;
    }
  } else {
    return FECHA_INVALIDA;
  }

  // Verificación final de la validez del objeto Date
  if (isNaN(d.getTime())) {
    return FECHA_INVALIDA;
  }
  // Formateo de la fecha a DD/MM/YYYY
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = d.getFullYear().toString();

  let resultado = `${dia}/${mes}/${anio}`;
// Inclusión opcional de la hora en formato HH:MM:SS
  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}
// src/utilidades/formatearFecha.ts

const FECHA_INVALIDA = 'Fecha inválida';

/**
 * Regex con grupos de captura para validar y extraer componentes de ISO 8601:
 * YYYY-MM-DDTHH:mm[:ss[.ms]] (Z o ±HH:mm)
 */
const REGEX_FECHA_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+\-](\d{2}):(\d{2}))$/;

/**
 * Formatea una fecha a formato DD/MM/YYYY (opcionalmente con HH:MM:SS).
 * * NOTA TÉCNICA: Esta función procesa la fecha en la zona horaria local del sistema.
 * Se validan los componentes para evitar la normalización automática de JavaScript.
 */
export function formatearFecha(fecha: string | Date | null | undefined, incluirHora: boolean = false): string {
  if (fecha === null || fecha === undefined) {
    return FECHA_INVALIDA;
  }

  let d: Date;

  if (fecha instanceof Date) {
    d = fecha;
  } else if (typeof fecha === 'string') {
    const fechaLimpia = fecha.trim();
    if (fechaLimpia === '') return FECHA_INVALIDA;

    // Caso 1: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
      const partes = fechaLimpia.split('-');
      const anio = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const dia = parseInt(partes[2], 10);
      
      d = new Date(anio, mes - 1, dia);

      if (d.getFullYear() !== anio || d.getMonth() !== mes - 1 || d.getDate() !== dia) {
        return FECHA_INVALIDA;
      }
    } 
    // Caso 2: ISO 8601 con validación de componentes
    else {
      const match = fechaLimpia.match(REGEX_FECHA_ISO_8601);
      if (match) {
        d = new Date(fechaLimpia);
        
        // Validamos que el objeto Date sea válido antes de comparar componentes
        if (Number.isNaN(d.getTime())) return FECHA_INVALIDA;

        // Comprobamos rangos básicos para evitar normalización (ej. Mes 13, Hora 25)
        const mes = parseInt(match[2], 10);
        const dia = parseInt(match[3], 10);
        const hora = parseInt(match[4], 10);
        const min = parseInt(match[5], 10);

        if (mes < 1 || mes > 12 || dia < 1 || dia > 31 || hora > 23 || min > 59) {
          return FECHA_INVALIDA;
        }
      } else {
        return FECHA_INVALIDA;
      }
    }
  } else {
    return FECHA_INVALIDA;
  }

  // Validación final usando Number.isNaN (Sugerencia de Copilot)
  if (Number.isNaN(d.getTime())) {
    return FECHA_INVALIDA;
  }
  
  const diaStr = d.getDate().toString().padStart(2, '0');
  const mesStr = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anioStr = d.getFullYear().toString();

  let resultado = `${diaStr}/${mesStr}/${anioStr}`;

  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}
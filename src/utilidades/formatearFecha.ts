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
    // Caso 2: ISO 8601 con validación de componentes para evitar normalización
    else {
      const match = fechaLimpia.match(REGEX_FECHA_ISO_8601);
      if (match) {
        d = new Date(fechaLimpia);
        
        if (Number.isNaN(d.getTime())) return FECHA_INVALIDA;

        // Validamos que los componentes no hayan sido normalizados (ej: 31 de febrero -> 02 de marzo)
        // Usamos los componentes UTC si el string es UTC para una comparación exacta
        const esUTC = fechaLimpia.endsWith('Z');
        const anioIn = parseInt(match[1], 10);
        const mesIn = parseInt(match[2], 10);
        const diaIn = parseInt(match[3], 10);

        const anioOut = esUTC ? d.getUTCFullYear() : d.getFullYear();
        const mesOut = (esUTC ? d.getUTCMonth() : d.getMonth()) + 1;
        const diaOut = esUTC ? d.getUTCDate() : d.getDate();

        if (anioIn !== anioOut || mesIn !== mesOut || diaIn !== diaOut) {
          return FECHA_INVALIDA;
        }
      } else {
        return FECHA_INVALIDA;
      }
    }
  } else {
    return FECHA_INVALIDA;
  }

  // Verificación de seguridad final para asegurar que el objeto Date es usable
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
// src/utilidades/formatearFecha.ts

const FECHA_INVALIDA = 'Fecha inválida';

/**
 * Regex con grupos de captura para validar y extraer componentes de ISO 8601:
 * YYYY-MM-DDTHH:mm[:ss[.ms]] (Z o ±HH:mm)
 */
const REGEX_FECHA_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+\-](\d{2}):(\d{2}))$/;

/**
 * Verifica si un año es bisiesto.
 */
const esBisiesto = (anio: number) => (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;

/**
 * Obtiene los días que tiene un mes específico.
 */
const obtenerDiasDelMes = (mes: number, anio: number) => {
  return [31, esBisiesto(anio) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1];
};

/**
 * Formatea una fecha a formato DD/MM/YYYY (opcionalmente con HH:mm:ss).
 * * NOTA TÉCNICA: Esta función procesa la fecha para su visualización en la zona 
 * horaria local del sistema. Valida rangos de calendario (incluyendo bisiestos) 
 * antes de la conversión para asegurar la integridad de los datos.
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
      const [anio, mes, dia] = fechaLimpia.split('-').map(Number);
      if (mes < 1 || mes > 12 || dia < 1 || dia > obtenerDiasDelMes(mes, anio)) {
        return FECHA_INVALIDA;
      }
      // Evitamos el comportamiento de 0-99 -> 1900-1999 usando setFullYear
      d = new Date(anio, mes - 1, dia);
      d.setFullYear(anio);
    } 
    // Caso 2: ISO 8601 (Validación lógica de componentes)
    else {
      const match = fechaLimpia.match(REGEX_FECHA_ISO_8601);
      if (match) {
        const anio = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const dia = parseInt(match[3], 10);
        const hora = parseInt(match[4], 10);
        const min = parseInt(match[5], 10);
        const seg = match[6] ? parseInt(match[6], 10) : 0;

        if (
          mes < 1 || mes > 12 || 
          dia < 1 || dia > obtenerDiasDelMes(mes, anio) ||
          hora > 23 || min > 59 || seg > 59
        ) {
          return FECHA_INVALIDA;
        }

        d = new Date(fechaLimpia);
      } else {
        return FECHA_INVALIDA;
      }
    }
  } else {
    return FECHA_INVALIDA;
  }

  if (Number.isNaN(d.getTime())) {
    return FECHA_INVALIDA;
  }
  
  const diaStr = d.getDate().toString().padStart(2, '0');
  const mesStr = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anioStr = d.getFullYear().toString().padStart(4, '0');

  let resultado = `${diaStr}/${mesStr}/${anioStr}`;

  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}
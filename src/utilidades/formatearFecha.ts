// src/utilidades/formatearFecha.ts

const FECHA_INVALIDA = 'Fecha inválida';

/**
 * Regex con grupos de captura para validar y extraer componentes de ISO 8601.
 * Valida estrictamente horas (00-23) y minutos (00-59) en el offset.
 * La zona horaria (Z o offset) ahora es opcional.
 */
const REGEX_FECHA_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+\-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

const esBisiesto = (anio: number) => (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;

const obtenerDiasDelMes = (mes: number, anio: number) => {
  return [31, esBisiesto(anio) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1];
};

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

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
      const [anio, mes, dia] = fechaLimpia.split('-').map(Number);
      if (mes < 1 || mes > 12 || dia < 1 || dia > obtenerDiasDelMes(mes, anio)) {
        return FECHA_INVALIDA;
      }
      d = new Date(anio, mes - 1, dia);
      d.setFullYear(anio);
    } 
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
        
        // Para ISO 8601 con zona horaria explícita (Z u offset) o locales sin zona,
        // se debe respetar el offset original al parsear.
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
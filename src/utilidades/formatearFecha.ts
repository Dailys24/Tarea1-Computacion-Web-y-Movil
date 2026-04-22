// src/utilidades/formatearFecha.ts

const FECHA_INVALIDA = 'Fecha inválida';

/**
 * Regex con grupos de captura para validar y extraer componentes de ISO 8601.
 * Valida estrictamente horas (00-23) y minutos (00-59) en el offset.
 * La zona horaria (Z o offset) es opcional.
 */
const REGEX_FECHA_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(?:Z|[+\-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

const esBisiesto = (anio: number) => (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;

const obtenerDiasDelMes = (mes: number, anio: number) => {
  return [31, esBisiesto(anio) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1];
};

export function formatearFecha(fecha: string | Date | null | undefined, incluirHora: boolean = false): string {
  if (fecha === null || fecha === undefined) return FECHA_INVALIDA;

  // Manejo directo de Strings: Extraemos y formateamos sin pasar por el motor de Timezone de JS
  if (typeof fecha === 'string') {
    const fechaLimpia = fecha.trim();
    if (fechaLimpia === '') return FECHA_INVALIDA;

    // Caso 1: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
      const [anio, mes, dia] = fechaLimpia.split('-').map(Number);
      if (mes < 1 || mes > 12 || dia < 1 || dia > obtenerDiasDelMes(mes, anio)) {
        return FECHA_INVALIDA;
      }
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio.toString().padStart(4, '0')}`;
    } 
    
    // Caso 2: ISO 8601
    const match = fechaLimpia.match(REGEX_FECHA_ISO_8601);
    if (match) {
      const anio = parseInt(match[1], 10);
      const mes = parseInt(match[2], 10);
      const dia = parseInt(match[3], 10);
      const hora = parseInt(match[4], 10);
      const min = parseInt(match[5], 10);
      const seg = match[6] ? parseInt(match[6], 10) : 0;

      if (
        mes < 1 || mes > 12 || dia < 1 || dia > obtenerDiasDelMes(mes, anio) ||
        hora > 23 || min > 59 || seg > 59
      ) {
        return FECHA_INVALIDA;
      }
      
      // Armamos la respuesta directamente con los componentes capturados (respeta el offset visual)
      let resultado = `${match[3]}/${match[2]}/${match[1]}`;
      if (incluirHora) {
        resultado += ` ${match[4]}:${match[5]}:${match[6] || '00'}`;
      }
      return resultado;
    }

    return FECHA_INVALIDA;
  }

  // Manejo de objetos Date nativos
  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) return FECHA_INVALIDA;

    const diaStr = fecha.getDate().toString().padStart(2, '0');
    const mesStr = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anioStr = fecha.getFullYear().toString().padStart(4, '0');

    let resultado = `${diaStr}/${mesStr}/${anioStr}`;

    if (incluirHora) {
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      const segundos = fecha.getSeconds().toString().padStart(2, '0');
      resultado += ` ${horas}:${minutos}:${segundos}`;
    }

    return resultado;
  }

  return FECHA_INVALIDA;
}
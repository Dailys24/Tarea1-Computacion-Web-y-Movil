// src/utilidades/formatearFecha.ts

const REGEX_FECHA_ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+\-]\d{2}:\d{2})$/;

export function formatearFecha(fecha: string | Date | null | undefined, incluirHora: boolean = false): string {
  // Validar si la fecha está vacía o nula
  if (fecha === null || fecha === undefined || fecha === '') {
    return 'Fecha inválida';
  }

  let d: Date;

  if (typeof fecha === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const partes = fecha.split('-');
      const anioLocal = parseInt(partes[0], 10);
      const mesLocal = parseInt(partes[1], 10);
      const diaLocal = parseInt(partes[2], 10);
      
      d = new Date(anioLocal, mesLocal - 1, diaLocal);

      // Validar que JS no haya inventado una fecha (ej: 30 de febrero)
      if (d.getFullYear() !== anioLocal || d.getMonth() !== mesLocal - 1 || d.getDate() !== diaLocal) {
        return 'Fecha inválida';
      }
    } else if (REGEX_FECHA_ISO_8601.test(fecha)) {
      d = new Date(fecha);
    } else {
      return 'Fecha inválida';
    }
  } else {
    if (!(fecha instanceof Date)) {
      return 'Fecha inválida';
    }
    d = fecha;
  }

  // Validar si JavaScript entiende la fecha
  if (isNaN(d.getTime())) {
    return 'Fecha inválida';
  }
  
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = d.getFullYear().toString();

  let resultado = `${dia}/${mes}/${anio}`;

  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}

// src/utilidades/formatearFecha.ts

<<<<<<< HEAD
// Copilot: Extraemos el mensaje a una constante para no repetir
const FECHA_INVALIDA = 'Fecha inválida';
=======
const REGEX_FECHA_ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+\-]\d{2}:\d{2})$/;
>>>>>>> a03a9c06341e434f35cbd6a23973b85d441cf4af

export function formatearFecha(fecha: string | Date | null | undefined, incluirHora: boolean = false): string {
  if (fecha === null || fecha === undefined) {
    return FECHA_INVALIDA;
  }

  let d: Date;

  if (fecha instanceof Date) {
    d = fecha;
  } else if (typeof fecha === 'string') {
    // Copilot: Limpiamos espacios en blanco al inicio o final antes de validar
    const fechaLimpia = fecha.trim();
    
    if (fechaLimpia === '') {
      return FECHA_INVALIDA;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
      const partes = fechaLimpia.split('-');
      const anioLocal = parseInt(partes[0], 10);
      const mesLocal = parseInt(partes[1], 10);
      const diaLocal = parseInt(partes[2], 10);
      
      d = new Date(anioLocal, mesLocal - 1, diaLocal);

      if (d.getFullYear() !== anioLocal || d.getMonth() !== mesLocal - 1 || d.getDate() !== diaLocal) {
        return FECHA_INVALIDA;
      }
<<<<<<< HEAD
    } else {
      // Intento de parseo nativo para otros formatos ISO
      d = new Date(fechaLimpia);
    }
  } else {
    return FECHA_INVALIDA;
=======
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
>>>>>>> a03a9c06341e434f35cbd6a23973b85d441cf4af
  }

  if (isNaN(d.getTime())) {
    return FECHA_INVALIDA;
  }
  
  // Copilot: Documentamos explícitamente que SIEMPRE se formatea mostrando la hora local del sistema
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

// src/utilidades/formatearFecha.ts

export function formatearFecha(fecha: string | Date, incluirHora: boolean = false): string {
  // copilot cambiar a comillas simplesy agregar validación de fecha vacía o nula
  if (fecha === null || fecha === undefined || fecha === '') {
    return 'Fecha inválida';
  }

  let d: Date;
// Validación adicional para formato ISO (YYYY-MM-DD) antes de usar el constructor de Date
  if (typeof fecha === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const partes = fecha.split('-');
      const anioLocal = parseInt(partes[0], 10);
      const mesLocal = parseInt(partes[1], 10);
      const diaLocal = parseInt(partes[2], 10);
      
      d = new Date(anioLocal, mesLocal - 1, diaLocal);

      // CORRECCIÓN COPILOT: Validar que JS no haya inventado una fecha (ej: 30 de febrero -> 2 de marzo)
      if (d.getFullYear() !== anioLocal || d.getMonth() !== mesLocal - 1 || d.getDate() !== diaLocal) {
        return 'Fecha inválida';
      }
    } else {
      d = new Date(fecha);
    }
  } else if (fecha instanceof Date) {
    d = fecha;
  } else {
    d = new Date(fecha);
  }

  // Validar si JavaScript entiende la fecha
  if (isNaN(d.getTime())) {
    return 'Fecha inválida';
  }
  // Formatear la fecha a DD/MM/YYYY
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = d.getFullYear().toString();

  let resultado = `${dia}/${mes}/${anio}`;
// Agregar hora si se solicita
  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}
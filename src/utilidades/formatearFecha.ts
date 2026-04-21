// src/utilidades/formatearFecha.ts

export function formatearFecha(fecha: string | Date, incluirHora: boolean = false): string {
  let d: Date;

  // 1. Convertimos lo que llegue a un objeto de Fecha (Date)
  if (typeof fecha === "string") {
    // Arreglo para que las fechas "YYYY-MM-DD" no se atrasen un día por la zona horaria UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const partes = fecha.split("-");
      // Los meses en JS empiezan en 0 (Enero = 0, Diciembre = 11), por eso el -1
      d = new Date(parseInt(partes[0], 10), parseInt(partes[1], 10) - 1, parseInt(partes[2], 10));
    } else {
      d = new Date(fecha);
    }
  } else if (fecha instanceof Date) {
    d = fecha;
  } else {
    return "Fecha inválida";
  }

  // 2. Validamos que la fecha tenga sentido
  if (isNaN(d.getTime())) {
    return "Fecha inválida";
  }
  
  // 3. Extraemos el día, mes y año usando padStart para que siempre tengan 2 dígitos ej 05, no 5
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0'); 
  const anio = d.getFullYear().toString();

  let resultado = `${dia}/${mes}/${anio}`;

  // 4. Si nos piden la hora, la agregamos al final
  if (incluirHora) {
    const horas = d.getHours().toString().padStart(2, '0');
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const segundos = d.getSeconds().toString().padStart(2, '0');
    
    resultado += ` ${horas}:${minutos}:${segundos}`;
  }

  return resultado;
}
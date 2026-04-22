// src/utilidades/genericos.ts

/**
 * Interfaz para el resultado de una paginación.
 */
interface ResultadoPaginado<T> {
  data: T[];
  totalPaginas: number;
  totalElementos: number;
  paginaActual: number;
}

/**
 * Ordena un array de objetos de forma genérica.
 * @template T - El tipo de objeto contenido en el array.
 * @param items - Lista de elementos a ordenar.
 * @param campo - La propiedad del objeto por la cual se desea ordenar.
 * @param orden - Dirección del ordenamiento: 'asc' o 'desc'.
 */
export function ordenarArray<T>(
  items: T[],
  campo: keyof T,
  orden: 'asc' | 'desc' = 'asc'
): T[] {
  // Creamos una copia para mantener la inmutabilidad del array original
  return [...items].sort((a, b) => {
    const valorA = a[campo];
    const valorB = b[campo];

    if (valorA < valorB) return orden === 'asc' ? -1 : 1;
    if (valorA > valorB) return orden === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Pagina un array de objetos de forma genérica.
 * @template T - El tipo de objeto contenido en el array.
 * @param items - Lista completa de elementos.
 * @param pagina - Número de página actual (inicia en 1).
 * @param tamañoPagina - Cantidad de elementos por página.
 */
export function paginarArray<T>(
  items: T[],
  pagina: number,
  tamañoPagina: number
): ResultadoPaginado<T> {
  const inicio = (pagina - 1) * tamañoPagina;
  const fin = inicio + tamañoPagina;
  const data = items.slice(inicio, fin);
  const totalPaginas = Math.ceil(items.length / tamañoPagina);

  return {
    data,
    totalPaginas,
    totalElementos: items.length,
    paginaActual: pagina
  };
}
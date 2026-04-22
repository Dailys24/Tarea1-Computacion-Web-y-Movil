// src/utilidades/genericos.ts

export interface ResultadoPaginado<T> {
  data: T[];
  totalPaginas: number;
  totalElementos: number;
  paginaActual: number;
}

// 1. Definimos qué cosas se pueden ordenar matemáticamente o alfabéticamente
type ValorOrdenable = string | number | Date;

// 2. Magia de TypeScript: Filtramos solo las llaves del objeto que sean ordenables
type CamposOrdenables<T> = {
  [K in keyof T]-?: Exclude<T[K], null | undefined> extends ValorOrdenable ? K : never;
}[keyof T];

// 3. Función para normalizar fechas a números y poder compararlas
function normalizarValorOrdenable(valor: ValorOrdenable): string | number {
  return valor instanceof Date ? valor.getTime() : valor;
}

/**
 * Ordena un array de objetos de forma genérica y tipada estáticamente.
 */
export function ordenarArray<T>(
  items: T[],
  campo: CamposOrdenables<T>,
  orden: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    // TypeScript ahora sabe que a[campo] solo puede ser string, number, Date, null o undefined
    const valorA = a[campo] as unknown as ValorOrdenable | null | undefined;
    const valorB = b[campo] as unknown as ValorOrdenable | null | undefined;

    // Manejo seguro para evitar caídas con valores nulos o indefinidos
    if (valorA === valorB) return 0;
    if (valorA == null) return 1;
    if (valorB == null) return -1;

    const comparableA = normalizarValorOrdenable(valorA);
    const comparableB = normalizarValorOrdenable(valorB);

    if (comparableA < comparableB) return orden === 'asc' ? -1 : 1;
    if (comparableA > comparableB) return orden === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Pagina un array de objetos de forma genérica con validación segura.
 */
export function paginarArray<T>(
  items: T[],
  pagina: number,
  tamanoPagina: number
): ResultadoPaginado<T> {
  const paginaNormalizada = Number.isFinite(pagina) ? Math.max(1, Math.floor(pagina)) : 1;
  const tamanoNormalizado = Number.isFinite(tamanoPagina) ? Math.max(1, Math.floor(tamanoPagina)) : 1;

  const inicio = (paginaNormalizada - 1) * tamanoNormalizado;
  const fin = inicio + tamanoNormalizado;
  const data = items.slice(inicio, fin);
  const totalPaginas = Math.ceil(items.length / tamanoNormalizado);

  return {
    data,
    totalPaginas,
    totalElementos: items.length,
    paginaActual: paginaNormalizada
  };
}
// src/utilidades/genericos.ts

export interface ResultadoPaginado<T> {
  data: T[];
  totalPaginas: number;
  totalElementos: number;
  paginaActual: number;
}

type ValorOrdenable = string | number | Date;

type CamposOrdenables<T> = {
  [K in keyof T]-?: Exclude<T[K], null | undefined> extends ValorOrdenable ? K : never;
}[keyof T];

function normalizarValorOrdenable(valor: ValorOrdenable): string | number {
  return valor instanceof Date ? valor.getTime() : valor;
}

export function ordenarArray<T>(
  items: T[],
  campo: CamposOrdenables<T>,
  orden: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valorA = a[campo] as unknown as ValorOrdenable | null | undefined;
    const valorB = b[campo] as unknown as ValorOrdenable | null | undefined;

    if (valorA === valorB) return 0;
    if (valorA == null) return 1;
    if (valorB == null) return -1;

    const comparableA = normalizarValorOrdenable(valorA);
    const comparableB = normalizarValorOrdenable(valorB);

    const isNaNA = typeof comparableA === 'number' && Number.isNaN(comparableA);
    const isNaNB = typeof comparableB === 'number' && Number.isNaN(comparableB);

    if (isNaNA && isNaNB) return 0;
    if (isNaNA) return 1; 
    if (isNaNB) return -1; 

    if (typeof comparableA === 'string' && typeof comparableB === 'string') {
      return orden === 'asc' 
        ? comparableA.localeCompare(comparableB, 'es') 
        : comparableB.localeCompare(comparableA, 'es');
    }

    if (typeof comparableA !== typeof comparableB) {
      const strA = String(comparableA);
      const strB = String(comparableB);
      return orden === 'asc' 
        ? strA.localeCompare(strB, 'es') 
        : strB.localeCompare(strA, 'es');
    }

    if (comparableA < comparableB) return orden === 'asc' ? -1 : 1;
    if (comparableA > comparableB) return orden === 'asc' ? 1 : -1;
    return 0;
  });
}

export function paginarArray<T>(
  items: T[],
  pagina: number,
  tamanoPagina: number
): ResultadoPaginado<T> {
  if (items.length === 0) {
    return {
      data: [],
      totalPaginas: 0,
      totalElementos: 0,
      paginaActual: 1 // Consistencia para APIs y UIs
    };
  }

  const paginaNormalizada = Number.isFinite(pagina) ? Math.max(1, Math.floor(pagina)) : 1;
  const tamanoNormalizado = Number.isFinite(tamanoPagina) ? Math.max(1, Math.floor(tamanoPagina)) : 1;

  const totalPaginas = Math.ceil(items.length / tamanoNormalizado);
  const paginaActual = Math.min(paginaNormalizada, totalPaginas);

  const inicio = (paginaActual - 1) * tamanoNormalizado;
  const fin = inicio + tamanoNormalizado;
  const data = items.slice(inicio, fin);

  return {
    data,
    totalPaginas,
    totalElementos: items.length,
    paginaActual
  };
}
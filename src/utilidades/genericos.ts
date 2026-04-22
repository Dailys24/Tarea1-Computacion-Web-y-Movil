// src/utilidades/genericos.ts

export interface ResultadoPaginado<T> {
  data: T[];
  totalPaginas: number;
  totalElementos: number;
  paginaActual: number;
}

export function ordenarArray<T>(
  items: T[],
  campo: keyof T,
  orden: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    // Usamos 'any' internamente para permitir la comparación de strings/numbers 
    // sin que el linter de TypeScript o Copilot bloqueen la compilación genérica
    const valorA = a[campo] as any;
    const valorB = b[campo] as any;

    // Manejo seguro para evitar caídas con valores nulos o indefinidos
    if (valorA === valorB) return 0;
    if (valorA == null) return 1;
    if (valorB == null) return -1;

    if (valorA < valorB) return orden === 'asc' ? -1 : 1;
    if (valorA > valorB) return orden === 'asc' ? 1 : -1;
    return 0;
  });
}

export function paginarArray<T>(
  items: T[],
  pagina: number,
  tamanoPagina: number
): ResultadoPaginado<T> {
  // Validación estricta para evitar páginas o tamaños negativos/cero
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
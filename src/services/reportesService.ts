// src/services/reportesService.ts

/**
 * Función auxiliar para garantizar precisión matemática en punto flotante.
 * Multiplica por 100, redondea y divide por 100 para asegurar 2 decimales exactos.
 */
const redondear = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;

export interface Venta {
  id: number;
  total: number;
  estado: string;
}

export interface Producto {
  nom: string;
  prec: number;
  stock: number;
  rating: number;
  activo?: boolean;
  cat?: "electronica" | "accesorios" | "audio" | "almacenamiento" | "componentes" | "muebles";
}

export interface Usuario {
  nombre: string;
  email: string;
  tipo: "admin" | "cliente" | "vendedor";
  puntos: number;
  activo?: boolean;
  bloqueado?: boolean;
}

export interface StatsResult {
  usuarios: {
    total: number;
    activos: number;
    bloqueados: number;
    admin: number;
    clientes: number;
    vendedores: number;
  };
  productos: {
    total: number;
    activos: number;
    inactivos: number;
    porCategoria: Record<string, number>;
    stockTotal: number;
    valorInventario: number;
  };
}

/**
 * Genera un reporte formateado asegurando la precisión de los cálculos.
 */
export function makeReport(type: 'ventas' | 'productos' | 'usuarios', from: string, to: string, data: any[]): string {
  if (!data || data.length === 0) {
    return `=== REPORTE DE ${type.toUpperCase()} ===\nDesde: ${from}\nHasta: ${to}\nSin datos para procesar.`;
  }

  let report = `=== REPORTE DE ${type.toUpperCase()} ===\nDesde: ${from}\nHasta: ${to}\n========================\n`;
  const count = data.length;

  if (type === "ventas") {
    const d = data as Venta[];
    let totalBruto = 0;
    let max = -Infinity;
    let min = Infinity;

    const lines = d.map(v => {
      totalBruto += v.total;
      if (v.total > max) max = v.total;
      if (v.total < min) min = v.total;
      return `Orden: ${v.id} | Total: $${redondear(v.total)} | Estado: ${v.estado}`;
    });

    const avg = redondear(totalBruto / count);
    const totalGeneral = redondear(totalBruto);

    report += lines.join("\n") + "\n------------------------\n";
    report += `Total órdenes: ${count}\nTotal ingresos: $${totalGeneral}\nPromedio por orden: $${avg}\nVenta máxima: $${redondear(max)}\nVenta mínima: $${redondear(min)}\n`;
  } 
  else if (type === "productos") {
    const d = data as Producto[];
    let totalBruto = 0;
    let max = -Infinity;
    let min = Infinity;

    const lines = d.map(p => {
      totalBruto += p.prec;
      if (p.prec > max) max = p.prec;
      if (p.prec < min) min = p.prec;
      return `Producto: ${p.nom} | Precio: $${redondear(p.prec)} | Stock: ${p.stock} | Rating: ${p.rating}`;
    });

    const avg = redondear(totalBruto / count);
    const totalGeneral = redondear(totalBruto);

    report += lines.join("\n") + "\n----------------------------\n";
    report += `Total productos: ${count}\nPrecio promedio: $${avg}\nPrecio máximo: $${redondear(max)}\nPrecio mínimo: $${redondear(min)}\n`;
  } 
  else if (type === "usuarios") {
    const d = data as Usuario[];
    let totalBruto = 0;
    let max = -Infinity;
    let min = Infinity;

    const lines = d.map(u => {
      totalBruto += u.puntos;
      if (u.puntos > max) max = u.puntos;
      if (u.puntos < min) min = u.puntos;
      return `Usuario: ${u.nombre} | Email: ${u.email} | Tipo: ${u.tipo} | Puntos: ${redondear(u.puntos)} | Activo: ${u.activo}`;
    });

    const avg = redondear(totalBruto / count);
    const totalGeneral = redondear(totalBruto);

    report += lines.join("\n") + "\n---------------------------\n";
    report += `Total usuarios: ${count}\nPuntos promedio: ${avg}\nMax puntos: ${redondear(max)}\nMin puntos: ${redondear(min)}\n`;
  }

  return report;
}

/**
 * Obtiene las estadísticas generales del sistema con un único recorrido para maximizar rendimiento.
 */
export function getStats(dbUsers: Usuario[], dbProducts: Producto[]): StatsResult {
  const usuariosStats = dbUsers.reduce(
    (acc, u) => {
      if (u.activo) acc.activos += 1;
      if (u.bloqueado) acc.bloqueados += 1;

      if (u.tipo === "admin") acc.admin += 1;
      else if (u.tipo === "cliente") acc.clientes += 1;
      else if (u.tipo === "vendedor") acc.vendedores += 1;

      return acc;
    },
    { activos: 0, bloqueados: 0, admin: 0, clientes: 0, vendedores: 0 }
  );

  const productosStats = dbProducts.reduce(
    (acc, p) => {
      if (p.activo) acc.activos += 1;
      else acc.inactivos += 1;

      if (p.cat) {
        acc.porCategoria[p.cat] = (acc.porCategoria[p.cat] || 0) + 1;
      }

      acc.stockTotal += p.stock;
      acc.valorInventario += p.prec * p.stock;

      return acc;
    },
    {
      activos: 0,
      inactivos: 0,
      porCategoria: {
        electronica: 0,
        accesorios: 0,
        audio: 0,
        almacenamiento: 0,
        componentes: 0,
        muebles: 0
      } as Record<string, number>,
      stockTotal: 0,
      valorInventario: 0
    }
  );

  return {
    usuarios: {
      total: dbUsers.length,
      ...usuariosStats
    },
    productos: {
      total: dbProducts.length,
      activos: productosStats.activos,
      inactivos: productosStats.inactivos,
      porCategoria: productosStats.porCategoria,
      stockTotal: productosStats.stockTotal,
      valorInventario: redondear(productosStats.valorInventario)
    }
  };
}
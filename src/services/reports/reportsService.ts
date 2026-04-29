// src/services/reportesService.ts

// Función para redondear a 2 decimales y evitar errores de punto flotante
const redondear = (num: number): number => Math.round(num * 100) / 100;

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

export function makeReport(
  type: "ventas" | "productos" | "usuarios",
  from: string,
  to: string,
  data: any[]
): string {
  if (!data || data.length === 0) {
    return `=== REPORTE DE ${type.toUpperCase()} ===\nDesde: ${from}\nHasta: ${to}\nSin datos para procesar.`;
  }

  let report = `=== REPORTE DE ${type.toUpperCase()} ===\nDesde: ${from}\nHasta: ${to}\n========================\n`;

  if (type === "ventas") {
    const ventas = data as Venta[];
    let suma = 0;
    let max = ventas[0].total;
    let min = ventas[0].total;

    const lineas = ventas.map((v) => {
      suma += v.total;
      if (v.total > max) max = v.total;
      if (v.total < min) min = v.total;
      return `Orden: ${v.id} | Total: $${redondear(v.total)} | Estado: ${v.estado}`;
    });

    const promedio = redondear(suma / ventas.length);
    const total = redondear(suma);

    report += lineas.join("\n") + "\n------------------------\n";
    report += `Total órdenes: ${ventas.length}\n`;
    report += `Total ingresos: $${total}\n`;
    report += `Promedio por orden: $${promedio}\n`;
    report += `Venta máxima: $${redondear(max)}\n`;
    report += `Venta mínima: $${redondear(min)}\n`;
  } else if (type === "productos") {
    const productos = data as Producto[];
    let suma = 0;
    let max = productos[0].prec;
    let min = productos[0].prec;

    const lineas = productos.map((p) => {
      suma += p.prec;
      if (p.prec > max) max = p.prec;
      if (p.prec < min) min = p.prec;
      return `Producto: ${p.nom} | Precio: $${redondear(p.prec)} | Stock: ${p.stock} | Rating: ${p.rating}`;
    });

    const promedio = redondear(suma / productos.length);
    const total = redondear(suma);

    report += lineas.join("\n") + "\n----------------------------\n";
    report += `Total productos: ${productos.length}\n`;
    report += `Precio promedio: $${promedio}\n`;
    report += `Precio máximo: $${redondear(max)}\n`;
    report += `Precio mínimo: $${redondear(min)}\n`;
  } else if (type === "usuarios") {
    const usuarios = data as Usuario[];
    let suma = 0;
    let max = usuarios[0].puntos;
    let min = usuarios[0].puntos;

    const lineas = usuarios.map((u) => {
      suma += u.puntos;
      if (u.puntos > max) max = u.puntos;
      if (u.puntos < min) min = u.puntos;
      return `Usuario: ${u.nombre} | Email: ${u.email} | Tipo: ${u.tipo} | Puntos: ${redondear(u.puntos)} | Activo: ${u.activo}`;
    });

    const promedio = redondear(suma / usuarios.length);
    const total = redondear(suma);

    report += lineas.join("\n") + "\n---------------------------\n";
    report += `Total usuarios: ${usuarios.length}\n`;
    report += `Puntos promedio: ${promedio}\n`;
    report += `Max puntos: ${redondear(max)}\n`;
    report += `Min puntos: ${redondear(min)}\n`;
  }

  return report;
}

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
      porCategoria: {} as Record<string, number>,
      stockTotal: 0,
      valorInventario: 0,
    }
  );

  return {
    usuarios: {
      total: dbUsers.length,
      ...usuariosStats,
    },
    productos: {
      total: dbProducts.length,
      activos: productosStats.activos,
      inactivos: productosStats.inactivos,
      porCategoria: productosStats.porCategoria,
      stockTotal: productosStats.stockTotal,
      valorInventario: redondear(productosStats.valorInventario),
    },
  };
}
// src/services/reportesService.ts

/**
 * Función auxiliar para garantizar precisión matemática en punto flotante.
 * Multiplica por 100, redondea y divide por 100 para asegurar 2 decimales exactos.
 */
const redondear = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;

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
    const totales = data.map(v => v.total);
    const totalGeneral = redondear(totales.reduce((acc, val) => acc + val, 0));
    const max = Math.max(...totales);
    const min = Math.min(...totales);
    const avg = redondear(totalGeneral / count);

    const lines = data.map(v => `Orden: ${v.id} | Total: $${redondear(v.total)} | Estado: ${v.estado}`);
    
    report += lines.join("\n") + "\n------------------------\n";
    report += `Total ordenes: ${count}\nTotal ingresos: $${totalGeneral}\nPromedio por orden: $${avg}\nVenta maxima: $${max}\nVenta minima: $${min}\n`;
  } 
  else if (type === "productos") {
    const precios = data.map(p => p.prec);
    const totalPrecios = redondear(precios.reduce((acc, val) => acc + val, 0));
    const max = Math.max(...precios);
    const min = Math.min(...precios);
    const avg = redondear(totalPrecios / count);

    const lines = data.map(p => `Producto: ${p.nom} | Precio: $${redondear(p.prec)} | Stock: ${p.stock} | Rating: ${p.rating}`);

    report += lines.join("\n") + "\n----------------------------\n";
    report += `Total productos: ${count}\nPrecio promedio: $${avg}\nPrecio maximo: $${max}\nPrecio minimo: $${min}\n`;
  } 
  else if (type === "usuarios") {
    const puntos = data.map(u => u.puntos);
    const totalPuntos = redondear(puntos.reduce((acc, val) => acc + val, 0));
    const max = Math.max(...puntos);
    const min = Math.min(...puntos);
    const avg = redondear(totalPuntos / count);

    const lines = data.map(u => `Usuario: ${u.nombre} | Email: ${u.email} | Tipo: ${u.tipo} | Puntos: ${u.puntos} | Activo: ${u.activo}`);

    report += lines.join("\n") + "\n---------------------------\n";
    report += `Total usuarios: ${count}\nPuntos promedio: ${avg}\nMax puntos: ${max}\nMin puntos: ${min}\n`;
  }

  return report;
}

/**
 * Obtiene las estadísticas generales del sistema con cálculos precisos.
 */
export function getStats(dbUsers: any[], dbProducts: any[]) {
  const stats = {
    usuarios: {
      total: dbUsers.length,
      activos: dbUsers.filter(u => u.activo).length,
      bloqueados: dbUsers.filter(u => u.bloqueado).length,
      admin: dbUsers.filter(u => u.tipo === "admin").length,
      clientes: dbUsers.filter(u => u.tipo === "cliente").length,
      vendedores: dbUsers.filter(u => u.tipo === "vendedor").length
    },
    productos: {
      total: dbProducts.length,
      activos: dbProducts.filter(p => p.activo).length,
      inactivos: dbProducts.filter(p => !p.activo).length,
      porCategoria: {
        electronica: dbProducts.filter(p => p.cat === "electronica").length,
        accesorios: dbProducts.filter(p => p.cat === "accesorios").length,
        audio: dbProducts.filter(p => p.cat === "audio").length,
        almacenamiento: dbProducts.filter(p => p.cat === "almacenamiento").length,
        componentes: dbProducts.filter(p => p.cat === "componentes").length,
        muebles: dbProducts.filter(p => p.cat === "muebles").length
      },
      stockTotal: dbProducts.reduce((acc, p) => acc + p.stock, 0),
      // Cálculo preciso de inventario (Precio * Stock) sumado de forma segura
      valorInventario: redondear(
        dbProducts.reduce((acc, p) => acc + (p.prec * p.stock), 0)
      )
    }
  };

  return stats;
}
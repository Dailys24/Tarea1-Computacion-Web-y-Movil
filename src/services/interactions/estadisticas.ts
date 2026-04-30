import { dbUsers } from "../../db/dbUsuers.ts";
import { dbProducts } from "../../db/dbProducts.ts";
import type { InterfaceCB } from "../../utils/interfaces/interfaces.ts";
import type {UserStats, ProductCategoryStats, ProductStats, StatsData} from "../../utils/interfaces/interfaces.ts";



export function getStats(): InterfaceCB {

//Inicializamos el objeto de estadísticas con valores nulos o vacíos
  const stats: StatsData = {
    usuarios: null,
    productos: null
  };

  // --- 1. Procesamiento de Usuarios ---
  // Usamos reduce para acumular las estadísticas sin bucles `for` clásicos
  stats.usuarios = dbUsers.reduce<UserStats>((acumulador, usuario) => {
    acumulador.total += 1;

    if (usuario.activo) acumulador.activos += 1;
    if (usuario.bloqueado) acumulador.bloqueados += 1;

    // Lógica switch para contar por tipo de usuario
    switch (usuario.tipo) {
      case "admin":
        acumulador.admin += 1;
        break;
      case "cliente":
        acumulador.clientes += 1;
        break;
      case "vendedor":
        acumulador.vendedores += 1;
        break;
      default:
        // Opcional: Manejo de tipos desconocidos si fuera necesario
        break;
    }

    return acumulador;
  }, {
    // Estado inicial
    total: 0,
    activos: 0,
    bloqueados: 0,
    admin: 0,
    clientes: 0,
    vendedores: 0
  });

  // --- 2. Procesamiento de Productos ---
  // Se hace en un solo bucle para calcular stock y valor del inventario simultáneamente
  stats.productos = dbProducts.reduce<ProductStats>((acumulador:any, producto) => {
    acumulador.total += 1;

    if (producto.activo) {
      acumulador.activos += 1;
    } else {
      acumulador.inactivos += 1;
    }

    // Actualizamos el contador de la categoría específica
    // Se asume que 'cat' es seguro gracias a la interfaz de producto
    acumulador.porCategoria[producto.cat] += 1;

    // Cálculo de valor del inventario (Stock * Precio)
    acumulador.stockTotal += producto.stock;
    acumulador.valorInventario += producto.stock * producto.prec;

    return acumulador;
  }, {
    // Estado inicial
    total: 0,
    activos: 0,
    inactivos: 0,
    porCategoria: {
      electronica: 0,
      accesorios: 0,
      audio: 0,
      almacenamiento: 0,
      componentes: 0,
      muebles: 0
    },
    stockTotal: 0,
    valorInventario: 0
  });

  // Envío de la respuesta exitosa
    return {
      ok: true,
      msg: "Estadísticas generadas exitosamente",
      data: stats
    };
}
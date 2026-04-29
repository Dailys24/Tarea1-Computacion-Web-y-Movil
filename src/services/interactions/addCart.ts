import {buscarUsuarioPorId} from "../../utils/buscarUsuarioID.ts";
import { dbProducts } from "../../db/dbProducts.ts";

interface OrderItem {
  prod: string;
  qty: number;
  precUnit: number;
  totalItem: number;
}

interface CheckoutResult {
  ok: boolean;
  msg: string;
  data?: {
    orden: any;
  };
}


/**
 * Helper: Calcula el precio base (subtotal) y construye la lista de items
 * Usa Map para evitar el bucle anidado (O(n*m) -> O(n))
 */
function calculateOrderDetails(userId: number): { subtotal: number; items: OrderItem[]; failed: boolean; msg: string } {
  const foundUser = buscarUsuarioPorId(userId);
  if (!foundUser) {
    return { subtotal: 0, items: [], failed: true, msg: "usuario no encontrado" };
  }

  if (foundUser.carrito.length === 0) {
    return { subtotal: 0, items: [], failed: true, msg: "carrito vacio" };
  }

  const itemMap = new Map<number, any>(dbProducts.map((p) => [p.id, p]));
  let subtotal = 0;
  const items: OrderItem[] = [];

  foundUser.carrito.forEach((cartItem) => {
    const product = itemMap.get(cartItem.prodId);
    // Si el producto fue eliminado del catálogo mientras se procesaba el carrito
    if (!product) {
      return { subtotal: 0, items: [], failed: true, msg: "producto eliminado durante proceso" };
    }

    const itemTotal = product.precio * cartItem.qty;
    subtotal += itemTotal;
    items.push({
      prod: product.nombre,
      qty: cartItem.qty,
      precUnit: product.precio,
      totalItem: itemTotal,
    });
  });

  return { subtotal, items, failed: false, msg: "calculos exitosos" };
}

/**
 * Helper: Aplica reglas de descuento y calcula impuestos
 */
function applyDiscounts(subtotal: number, user: any): { descuentoPct: number; descuentoMonto: number; totalSinIva: number; iva: number; total: number } {
  // Tabla de descuentos por puntos para evitar largos if/else
  let baseDiscountPct = 0;
  const points = user.puntos || 0;

  if (points >= 300) baseDiscountPct = 15;
  else if (points >= 200) baseDiscountPct = 10;
  else if (points >= 100) baseDiscountPct = 5;
  // else 0

  // Descuento adicional personal
  const totalDiscountPct = baseDiscountPct + (user.descuento || 0);
  const discountAmount = subtotal * (totalDiscountPct / 100);
  const finalBeforeTax = subtotal - discountAmount;
  const iva = finalBeforeTax * 0.19;
  const total = finalBeforeTax + iva;

  return {
    descuentoPct: totalDiscountPct,
    descuentoMonto: discountAmount,
    totalSinIva: finalBeforeTax,
    iva,
    total,
  };
}

/**
 * Helper: Simula validación de pago
 */
function validatePayment(method: string, extraData: any): boolean {
  if (method === "tarjeta") {
    // Simulación: extraData debe contener numero (16 dígitos) y cvv (3 dígitos)
    const data = extraData || {};
    if (!data.numero || data.numero.length !== 16) return false;
    if (!data.cvv || data.cvv.length !== 3) return false;
    return true;
  }
  // Transferencia y efectivo se aceptan siempre en este ejemplo
  return true;
}

/**
 * Función Principal: checkout
 */

interface interfazCallback { 
  ok:boolean,
  msg:string,
  data?: any
}

 interface formatoCompra {
  idUser: number;
  metodoPago: string;
  direccion: string;
  extraPaymentData?: any; // Para datos adicionales como info de tarjeta
};

let compraEjemplo: formatoCompra = {
  idUser: 2,
  metodoPago: "tarjeta",
  direccion: "Calle Falsa 123",
}


function comprar(compraEjemplo: formatoCompra ) : interfazCallback {

  const metodoPago: string = compraEjemplo.metodoPago;
  const direccion: string = compraEjemplo.direccion;
  const extraPaymentData: any = compraEjemplo.extraPaymentData || null; // Extra para validar tarjeta

  // 1. Encontrar usuario
  const foundUser = buscarUsuarioPorId(compraEjemplo.idUser);
  if (!foundUser) {
    return { ok: false, msg: "usuario no encontrado", data: null };
  }
  //Validar Carrito 
  if (foundUser.carrito.length === 0) {
    return { ok: false, msg: "carrito vacio", data: null };
  }

  // 2. Calcular detalles de la orden
  const calculationResult = calculateOrderDetails(compraEjemplo.idUser);
  if (calculationResult.failed) {
    return { ok: false, msg: calculationResult.msg, data: null };
  }

  // 3. Calcular descuentos e impuestos
  const financials = applyDiscounts(calculationResult.subtotal, foundUser);

  // 4. Procesar Pago
  const pagoOk = validatePayment(metodoPago, extraPaymentData);
  if (!pagoOk) {
    return { ok: false, msg: "metodo de pago no valido", data: null };
  }

  // 5. Construir Objeto de Orden
  const ordenId = `ORD-${Date.now()}`;
  const orden = {
    id: ordenId,
    userId: compraEjemplo.idUser,
    items: calculationResult.items,
    subtotal: calculationResult.subtotal,
    descuentoPct: financials.descuentoPct,
    descuentoMonto: financials.descuentoMonto,
    totalSinIva: financials.totalSinIva,
    iva: financials.iva,
    total: financials.total,
    metodoPago,
    direccion,
    estado: "pagado", // Se marca como pagado tras la validación exitosa
    puntosGanados: Math.floor(financials.total / 1000),
    createdAt: new Date(),
  };

  // 6. Actualizar Estado del Sistema (Stock, Puntos, Carrito, Historial)
  const itemsOrden = orden.items;

  // Ajustar Stock (Validando que no haya stock negativo por errores de concurrencia)
  itemsOrden.forEach((item) => {
    const product = dbProducts.find((p) => p.id === item.prodId);
    if (product && product.stock >= item.qty) {
      product.stock -= item.qty;
    } else {
      // Manejo de error si el stock cambió mientras procesábamos
      console.error("Stock insuficiente inesperado para producto", item.prodId);
    }
  });

  // Sumar puntos al usuario
  foundUser.puntos += orden.puntosGanados;

  // Limpiar carrito
  foundUser.carrito = [];

  // Registrar en historial
  foundUser.historial.push(orden);

  // 7. Retornar éxito
  return { ok: true, msg: "orden creada exitosamente", data: orden };

}
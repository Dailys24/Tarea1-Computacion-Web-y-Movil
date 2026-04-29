import { buscarUsuarioPorId } from "../../utils/buscarUsuarioID";
import { dbProducts } from "../../db/dbProducts.ts";
import { dbUsers } from "../../db/dbUsuers.ts";
import type {InterfaceCB, CarritoItem, interfazProducto}  from "../../utils/interfaces/interfaces";
import { validarCredito } from "../../utils/validaciones.ts";
import { metodoPago } from "../../services/calc/metodoPago.ts";

export function procesarPago(idUsuario: number, direccion: any, opcionMetodo: number): InterfaceCB {

    const usuarioEncontrado = buscarUsuarioPorId(idUsuario) || null;

    if (usuarioEncontrado == null) {
      return { ok: false, msg: "usuario no encontrado", data: null };
    }
    if (usuarioEncontrado.carrito.length == 0) {
      return { ok: false, msg: "carrito vacio", data: null };
    }

    // calcular subtotal
// 1. Crear un índice rápido (Map) de productos
    const catalogoMap = new Map(dbProducts.map(producto => [producto.id, producto]));
    let subtotal = 0;
    let itemsOrden : any = [];  

// 2. Recorrer solo el carrito (una sola vez)
    usuarioEncontrado.carrito.forEach((cartItem: CarritoItem) => {
        const producto = catalogoMap.get(cartItem.prodId);

  // Validación: si el producto existe en el catálogo
  if (producto) {
    const itemTotal = producto.prec * cartItem.cantidad;
    
    subtotal += itemTotal; // Acumular precio
    itemsOrden.push({ 
      prod: producto.nom, 
      qty: cartItem.cantidad, 
      precUnit: producto.prec, 
      totalItem: itemTotal 
    });
  }
});
    // aplicar descuentos
    var descuento = 0;
    var descuentoMonto = 0;
    // descuento por nivel
    if (usuarioEncontrado.puntos >= 0 && usuarioEncontrado.puntos < 100) {
      descuento = 0;
    }
    if (usuarioEncontrado.puntos >= 100 && usuarioEncontrado.puntos < 200) {
      descuento = 5;
    }
    if (usuarioEncontrado.puntos >= 200 && usuarioEncontrado.puntos < 300) {
      descuento = 10;
    }
    if (usuarioEncontrado.puntos >= 300) {
      descuento = 15;
    }



    // descuento adicional del usuario
    descuento = descuento + usuarioEncontrado.descuento;
    descuentoMonto = subtotal * (descuento / 100);
    var totalConDescuento = subtotal - descuentoMonto;
    // calcular iva
    var iva = totalConDescuento * 0.19;
    var totalFinal = totalConDescuento + iva;
    // calcular puntos ganados
    var puntosGanados = Math.floor(totalFinal / 1000);
    // crear orden
    var ordenId = "ORD-" + Date.now();
    var orden = {
      id: ordenId,
      userId: usuarioEncontrado.id,
      items: itemsOrden,
      subtotal: subtotal,
      descuentoPct: descuento,
      descuentoMonto: descuentoMonto,
      totalSinIva: totalConDescuento,
      iva: iva,
      total: totalFinal,
      metodoPago: opcionMetodo,
      direccion: direccion,
      estado: "pendiente",
      puntosGanados: puntosGanados,
      createdAt: new Date()
    };
    // actualizar stock
    let itemsActualizados: interfazProducto[] = [];
    for (var i = 0; i < usuarioEncontrado.carrito.length; i++) {
      for (var j = 0; j < dbProducts.length; j++) {
        if (dbProducts[j].id == usuarioEncontrado.carrito[i].prodId) {
          dbProducts[j].stock = dbProducts[j].stock - usuarioEncontrado.carrito[i].cantidad;
          itemsActualizados.push(dbProducts[j]);
          break;
        }
      }
    }
    // agregar puntos al usuario
    usuarioEncontrado.puntos = usuarioEncontrado.puntos + puntosGanados;
    // limpiar carrito
    usuarioEncontrado.carrito = [];
    // agregar al historial
    usuarioEncontrado.historial.push(orden);
    // simular proceso de pago

    //PAGANDO
    metodoPago(opcionMetodo);

  return { ok: true, msg: "Pago procesado con éxito", data: orden };
}
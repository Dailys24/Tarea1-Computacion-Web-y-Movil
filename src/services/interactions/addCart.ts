import { dbProducts, type interfazProducto } from "../../db/dbProducts.ts";
import {
  type CartItem,
  type MetodoPago,
  type Order,
  type OrderItem,
  type Usuario,
} from "../../db/dbUsuers.ts";
import { buscarUsuarioPorId } from "../../utils/buscarUsuarioID.ts";

// ============================================================================
// Tipos públicos
// ============================================================================

// Resultado estándar de cualquier operación del carrito/checkout.
// data?: T trae el detalle cuando ok === true.
export interface Resultado<T = unknown> {
  ok: boolean;
  msg: string;
  data?: T;
}

export interface ResumenCarrito {
  carrito: CartItem[];
  total: number;
}

export interface DatosTarjeta {
  numero?: string;
  cvv?: string;
  expiry?: string;
}

export interface DatosCompra {
  userId: number;
  metodoPago: MetodoPago;
  direccion: string;
  datosTarjeta?: DatosTarjeta;
}

// ============================================================================
// Helpers internos
// ============================================================================

function buscarProductoPorId(prodId: number): interfazProducto | null {
  return dbProducts.find((p) => p.id === prodId) ?? null;
}

function calcularTotalCarrito(carrito: CartItem[]): number {
  return carrito.reduce((acc, item) => {
    const producto = buscarProductoPorId(item.prodId);
    return producto ? acc + producto.prec * item.qty : acc;
  }, 0);
}

// Tabla de descuentos por puntos. Reemplaza el if/if/if/if del problema.js
function calcularDescuentoPorPuntos(puntos: number): number {
  if (puntos >= 300) return 15;
  if (puntos >= 200) return 10;
  if (puntos >= 100) return 5;
  return 0;
}

// Validación de pago. La de tarjeta exige número de 16 dígitos y CVV de 3.
function validarPago(metodo: MetodoPago, datos?: DatosTarjeta): Resultado {
  if (metodo === "transferencia" || metodo === "efectivo") {
    return { ok: true, msg: "Pago aceptado" };
  }
  if (metodo === "tarjeta") {
    if (!datos) return { ok: false, msg: "Faltan datos de la tarjeta" };
    const numero = (datos.numero ?? "").replace(/\s/g, "");
    const cvv = datos.cvv ?? "";
    if (numero.length !== 16 || !/^\d+$/.test(numero)) {
      return { ok: false, msg: "Número de tarjeta inválido" };
    }
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      return { ok: false, msg: "CVV inválido" };
    }
    return { ok: true, msg: "Tarjeta válida" };
  }
  return { ok: false, msg: "Método de pago no reconocido" };
}

// Si el usuario no puede operar, devuelve { ok:false, msg }. Si puede, devuelve null.
// Tipar el "error" sin la T genérica de Resultado evita problemas de varianza
// cuando lo usamos como early-return en funciones que retornan Resultado<X>.
function chequearUsuario(usuario: Usuario): { ok: false; msg: string } | null {
  if (!usuario.activo) return { ok: false, msg: "Usuario inactivo" };
  if (usuario.bloqueado) return { ok: false, msg: "Usuario bloqueado" };
  return null;
}

// ============================================================================
// API pública del carrito
// ============================================================================

// Agrega `qty` unidades de `prodId` al carrito de `userId`.
// Si el producto ya estaba en el carrito, suma cantidades.
// Verifica stock contra (cantidad ya en carrito + qty nueva).
export function agregarAlCarrito(
  userId: number,
  prodId: number,
  qty: number,
): Resultado<ResumenCarrito> {
  if (!Number.isInteger(qty) || qty <= 0) {
    return { ok: false, msg: "La cantidad debe ser un entero positivo" };
  }

  const usuario = buscarUsuarioPorId(userId);
  if (!usuario) return { ok: false, msg: "Usuario no encontrado" };

  const errorUsuario = chequearUsuario(usuario);
  if (errorUsuario) return errorUsuario;

  const producto = buscarProductoPorId(prodId);
  if (!producto) return { ok: false, msg: "Producto no encontrado" };
  if (!producto.activo) return { ok: false, msg: "Producto no disponible" };

  const itemExistente = usuario.carrito.find((c) => c.prodId === prodId);
  const cantidadFinal = (itemExistente?.qty ?? 0) + qty;

  if (producto.stock < cantidadFinal) {
    return {
      ok: false,
      msg: `Stock insuficiente (disponible: ${producto.stock}, solicitado: ${cantidadFinal})`,
    };
  }

  if (itemExistente) {
    itemExistente.qty = cantidadFinal;
  } else {
    usuario.carrito.push({ prodId, qty, addedAt: new Date() });
  }

  return {
    ok: true,
    msg: "Producto agregado al carrito",
    data: {
      carrito: usuario.carrito,
      total: calcularTotalCarrito(usuario.carrito),
    },
  };
}

// Quita por completo un producto del carrito (sin importar la cantidad).
export function quitarDelCarrito(
  userId: number,
  prodId: number,
): Resultado<ResumenCarrito> {
  const usuario = buscarUsuarioPorId(userId);
  if (!usuario) return { ok: false, msg: "Usuario no encontrado" };

  const idx = usuario.carrito.findIndex((c) => c.prodId === prodId);
  if (idx === -1) return { ok: false, msg: "Producto no está en el carrito" };

  usuario.carrito.splice(idx, 1);
  return {
    ok: true,
    msg: "Producto removido del carrito",
    data: {
      carrito: usuario.carrito,
      total: calcularTotalCarrito(usuario.carrito),
    },
  };
}

// Devuelve el carrito actual del usuario y su total (lectura, no muta).
export function verCarrito(userId: number): Resultado<ResumenCarrito> {
  const usuario = buscarUsuarioPorId(userId);
  if (!usuario) return { ok: false, msg: "Usuario no encontrado" };
  return {
    ok: true,
    msg: "OK",
    data: {
      carrito: usuario.carrito,
      total: calcularTotalCarrito(usuario.carrito),
    },
  };
}

// ============================================================================
// Checkout / compra
// ============================================================================
// Flujo: validar usuario -> validar pago -> verificar stock real de cada item ->
// calcular descuentos+IVA -> crear orden -> descontar stock -> sumar puntos ->
// limpiar carrito -> persistir en historial.
export function comprar(datos: DatosCompra): Resultado<Order> {
  const usuario = buscarUsuarioPorId(datos.userId);
  if (!usuario) return { ok: false, msg: "Usuario no encontrado" };

  const errorUsuario = chequearUsuario(usuario);
  if (errorUsuario) return errorUsuario;

  if (usuario.carrito.length === 0) {
    return { ok: false, msg: "Carrito vacío" };
  }

  const validacionPago = validarPago(datos.metodoPago, datos.datosTarjeta);
  if (!validacionPago.ok) return { ok: false, msg: validacionPago.msg };

  // Construimos los items y calculamos subtotal.
  // Si algún producto desapareció o no tiene stock, abortamos antes de mutar nada.
  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const cartItem of usuario.carrito) {
    const producto = buscarProductoPorId(cartItem.prodId);
    if (!producto) {
      return {
        ok: false,
        msg: `El producto ${cartItem.prodId} ya no existe en el catálogo`,
      };
    }
    if (!producto.activo) {
      return { ok: false, msg: `"${producto.nom}" no está disponible` };
    }
    if (producto.stock < cartItem.qty) {
      return {
        ok: false,
        msg: `Stock insuficiente para "${producto.nom}" (disponible: ${producto.stock})`,
      };
    }

    const totalItem = producto.prec * cartItem.qty;
    subtotal += totalItem;
    items.push({
      prodId: producto.id,
      nom: producto.nom,
      qty: cartItem.qty,
      precUnit: producto.prec,
      totalItem,
    });
  }

  const descuentoPct =
    calcularDescuentoPorPuntos(usuario.puntos) + (usuario.descuento ?? 0);
  const descuentoMonto = subtotal * (descuentoPct / 100);
  const totalSinIva = subtotal - descuentoMonto;
  const iva = totalSinIva * 0.19;
  const total = totalSinIva + iva;
  const puntosGanados = Math.floor(total / 1000);

  const orden: Order = {
    id: `ORD-${Date.now()}`,
    userId: datos.userId,
    items,
    subtotal,
    descuentoPct,
    descuentoMonto,
    totalSinIva,
    iva,
    total,
    metodoPago: datos.metodoPago,
    direccion: datos.direccion,
    estado: "pagado",
    puntosGanados,
    createdAt: new Date(),
  };

  // Recién acá tocamos el estado del sistema (todo o nada).
  for (const item of items) {
    const producto = buscarProductoPorId(item.prodId);
    if (producto) producto.stock -= item.qty;
  }
  usuario.puntos += puntosGanados;
  usuario.carrito = [];
  usuario.historial.push(orden);

  return { ok: true, msg: "Orden creada exitosamente", data: orden };
}

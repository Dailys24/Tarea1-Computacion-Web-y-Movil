// Migración del cupon() del problema.js: separa datos, validación y cálculo.

export type TipoCupon = "porcentaje" | "fijo" | "envio";

export interface Cupon {
  code: string;
  tipo: TipoCupon;
  // Para "porcentaje" representa el % a descontar (ej: 10 = 10%).
  // Para "fijo" representa un monto en pesos.
  // Para "envio" representa el % de descuento sobre el costo de envío.
  valor: number;
  minCompra: number;
  maxUsos: number;
  usos: number;
  activo: boolean;
  expira: string; // YYYY-MM-DD
  categorias: string[];
  usuarios: number[]; // si está vacío, aplica a cualquier usuario
}

// "Base de datos" simulada (igual que la que tenía el problema.js, pero tipada
// y exportada para que sea fácil de testear).
export const dbCupones: Cupon[] = [
  { code: "DESC10",     tipo: "porcentaje", valor: 10, minCompra: 50000,  maxUsos: 100,  usos: 45,  activo: true, expira: "2027-12-31", categorias: [],              usuarios: [] },
  { code: "DESC20",     tipo: "porcentaje", valor: 20, minCompra: 100000, maxUsos: 50,   usos: 49,  activo: true, expira: "2027-06-30", categorias: ["electronica"], usuarios: [] },
  { code: "ENVGRATIS",  tipo: "envio",      valor: 100,minCompra: 30000,  maxUsos: 200,  usos: 180, activo: true, expira: "2027-12-31", categorias: [],              usuarios: [] },
  { code: "BIENVENIDO", tipo: "fijo",       valor: 5000,minCompra: 20000, maxUsos: 1000, usos: 523, activo: true, expira: "2027-12-31", categorias: [],              usuarios: [] },
  { code: "VIP",        tipo: "porcentaje", valor: 25, minCompra: 200000, maxUsos: 20,   usos: 15,  activo: true, expira: "2027-12-31", categorias: [],              usuarios: [1, 3, 5] },
];

export interface ResultadoCupon {
  ok: boolean;
  msg: string;
  // Monto absoluto a descontar del cartTotal (ya calculado).
  descuento: number;
  // Sólo está presente si el cupón es válido.
  tipo: TipoCupon | null;
  // Sólo se completa cuando el cupón es de tipo "porcentaje" (para uso en calc()).
  porcentaje: number;
}

const respuestaInvalida = (msg: string): ResultadoCupon => ({
  ok: false,
  msg,
  descuento: 0,
  tipo: null,
  porcentaje: 0,
});

// Aplica el cupón identificado por `code` al carrito.
// Si todo es válido, devuelve el descuento ya calculado en pesos (`descuento`)
// y, si era de tipo porcentaje, también el `porcentaje` para usarlo aguas abajo.
// IMPORTANTE: incrementa `usos` del cupón sólo cuando el cupón se aplica con éxito.
export function aplicarCupon(
  code: string,
  userId: number,
  cartTotal: number,
): ResultadoCupon {
  const cupon = dbCupones.find((c) => c.code === code);
  if (!cupon) return respuestaInvalida("cupon no existe");
  if (!cupon.activo) return respuestaInvalida("cupon inactivo");

  const hoy = new Date();
  const vencimiento = new Date(cupon.expira);
  if (Number.isNaN(vencimiento.getTime())) {
    return respuestaInvalida("fecha de expiracion invalida");
  }
  if (hoy > vencimiento) return respuestaInvalida("cupon expirado");

  if (cupon.usos >= cupon.maxUsos) return respuestaInvalida("cupon agotado");

  if (cartTotal < cupon.minCompra) {
    return respuestaInvalida("monto minimo no alcanzado");
  }

  if (cupon.usuarios.length > 0 && !cupon.usuarios.includes(userId)) {
    return respuestaInvalida("cupon no valido para este usuario");
  }

  // Cálculo del descuento según tipo
  let descuento = 0;
  let porcentaje = 0;
  if (cupon.tipo === "porcentaje") {
    porcentaje = cupon.valor;
    descuento = cartTotal * (cupon.valor / 100);
  } else if (cupon.tipo === "fijo") {
    descuento = Math.min(cupon.valor, cartTotal);
  } else if (cupon.tipo === "envio") {
    // El descuento sobre envío se calcula afuera; acá sólo informamos el %.
    descuento = cupon.valor;
  }

  cupon.usos += 1;

  return {
    ok: true,
    msg: "cupon aplicado",
    descuento,
    tipo: cupon.tipo,
    porcentaje,
  };
}

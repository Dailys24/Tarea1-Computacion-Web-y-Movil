import { calc } from "./calc.ts";
import { aplicarCupon, type ResultadoCupon } from "../cupon/cupon.ts";

// Conecta el sistema de cupones con el cálculo del total.
// En vez de llamar aplicarCupon() y calc() por separado, los une en un paso.
export const calcConCupon = (
  precioBase: number,
  descuentoNivel: number,
  codigoCupon: string | null,
  userId: number,
  descuentoEspecial: number,
  iva: boolean,
  envio: number,
  cuotas: number,
) => {
  // Si viene un código lo validamos con aplicarCupon(), si no, dejamos un objeto
  // por defecto que represente "sin cupón" y no descuente nada.
  const infoCupon: ResultadoCupon =
    codigoCupon && codigoCupon !== ""
      ? aplicarCupon(codigoCupon, userId, precioBase)
      : { ok: false, msg: "sin cupon", descuento: 0, tipo: null, porcentaje: 0 };

  // Sólo aplicamos descuento como % si el cupón es válido y de tipo porcentaje.
  // Los cupones "fijo" y "envio" se manejan afuera (no es responsabilidad de calc()).
  const descuentoCuponPct =
    infoCupon.ok && infoCupon.tipo === "porcentaje" ? infoCupon.porcentaje : 0;

  const resultado = calc(
    precioBase,
    descuentoNivel,
    descuentoCuponPct,
    descuentoEspecial,
    iva,
    envio,
    cuotas,
  );

  return { ...resultado, cupon: infoCupon };
};

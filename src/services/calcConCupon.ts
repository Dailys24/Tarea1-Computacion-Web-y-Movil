// esta funcion conecta el sistema de cupones con el calculo del total
// en vez de llamar cupon() y calc() por separado, los une en un solo paso

const calcConCupon = (
  precioBase: number,
  descuentoNivel: number,
  codigoCupon: string | null,
  userId: number,
  descuentoEspecial: number,
  iva: boolean,
  envio: number,
  cuotas: number
) => {
  // si viene un codigo lo validamos con cupon(), si no mandamos un objeto vacio por defecto
  let infoCupon;
  if (codigoCupon && codigoCupon !== "") {
    infoCupon = cupon(codigoCupon, userId, precioBase, []);
  } else {
    infoCupon = { ok: false, msg: "sin cupon", descuento: 0, tipo: null, porcentaje: 0 };
  }

  // solo usamos el porcentaje si el cupon es valido y es de tipo porcentaje
  let descuentoCuponPct: number = 0;
  if (infoCupon.ok && infoCupon.tipo === "porcentaje") {
    descuentoCuponPct = infoCupon.porcentaje;
  }

  // llamamos a calc() con el descuento del cupon incluido
  const resultado = calc(precioBase, descuentoNivel, descuentoCuponPct, descuentoEspecial, iva, envio, cuotas);

  // retornamos todo lo de calc() mas la info del cupon para saber que paso
  return { ...resultado, cupon: infoCupon };
};

export { calcConCupon };

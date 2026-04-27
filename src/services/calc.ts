// separamos el calculo en sub-funciones para que cada una haga una sola cosa

// recibe un precio y un porcentaje, devuelve cuanto se descuenta y el precio final
const calcularDescuento = (precio: number, porcentaje: number) => {
  if (porcentaje <= 0) {
    return { monto: 0, precioFinal: precio };
  }
  const monto = precio * (porcentaje / 100);
  return { monto, precioFinal: precio - monto };
};

// calcula el 19% de IVA sobre un precio
const calcularIVA = (precio: number) => precio * 0.19;

// busca la tasa en el diccionario segun las cuotas y calcula el cargo
// si las cuotas no estan en el diccionario o son 1, no hay cargo
const calcularCargoCuotas = (precio: number, cuotas: number) => {
  const tasas: Record<number, number> = { 2: 0.02, 3: 0.04, 6: 0.08, 12: 0.15, 24: 0.28, 36: 0.45 };
  if (cuotas <= 1 || !tasas[cuotas]) {
    return 0;
  }
  return precio * tasas[cuotas];
};

function calc(
  precioBase: number,
  descuentoNivel: number,
  descuentoCupon: number,
  descuentoEspecial: number,
  iva: boolean,
  envio: number,
  cuotas: number
) {
  // aplicamos los 3 descuentos en cascada, cada uno sobre el precio que dejo el anterior
  const dscto1 = calcularDescuento(precioBase, descuentoNivel);
  const dscto2 = calcularDescuento(dscto1.precioFinal, descuentoCupon);
  const dscto3 = calcularDescuento(dscto2.precioFinal, descuentoEspecial);

  // solo aplicamos IVA si el parametro iva es true
  const montoIVA = iva ? calcularIVA(dscto3.precioFinal) : 0;
  const precioConIVA = dscto3.precioFinal + montoIVA;

  // sumamos el envio si tiene costo
  const subtotalConEnvio = precioConIVA + (envio > 0 ? envio : 0);

  // por ultimo sumamos el recargo por cuotas si aplica
  const cargoCuotas = calcularCargoCuotas(subtotalConEnvio, cuotas);
  const totalFinal = subtotalConEnvio + cargoCuotas;

  return {
    base: precioBase,
    dscto1: dscto1.monto,
    dscto2: dscto2.monto,
    dscto3: dscto3.monto,
    subtotal: subtotalConEnvio,
    iva: montoIVA,
    envio,
    totalCuota: cuotas > 1 ? totalFinal / cuotas : totalFinal,
    total: totalFinal,
  };
}

export { calc, calcularDescuento, calcularIVA, calcularCargoCuotas };

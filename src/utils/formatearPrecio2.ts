// se eliminaron fmtPrice y mostrarPrecio, queda solo esta
const formatearPrecio = (num: number): string =>
  "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export { formatearPrecio };

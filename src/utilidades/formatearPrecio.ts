// FUncion auxiliar para formatear precios 200 IQ

export function formatearPrecio(valor: number): string {
    //Intl.NumberFormat objeto de JS para formatear numeros segun region 
    //'es-ES' Es para que coloque comas en vez de puntos en los decimales no como los gringos enfermos xd
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR', // Moneda elegida, se puede cambiar si hace falta pe
    minimumFractionDigits: 2, //Cantidad Minima de decimales permitidos
    maximumFractionDigits: 2 //Cantidad Maxima de decimales permitidos  xd
  }).format(valor);  //Aplicamos el formateo
}
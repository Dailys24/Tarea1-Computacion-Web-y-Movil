//  Interfaz que formaliza el contenido de el objeto stockStatus 
import {dbProducts} from "../db/dbProducts.ts"

interface StockStatus {
  status: string;
  color: string;
  alerta: boolean;
}

//Aqui definimos las reglas de inventario asignadole un color a partir de una cierta cantidad
const limiteDeInventario = {
  AGOTADO: { max: 0, status: "Agotado", color: "rojo", alerta: true },
  CRITICO: { max: 5, status: "Crítico", color: "naranja", alerta: true },
  BAJO: { max: 15, status: "Bajo", color: "amarillo", alerta: true },
  NORMAL: { max: 30, status: "Normal", color: "verde", alerta: false },
  ALTO: { max: Infinity, status: "Alto", color: "verde", alerta: false }, // Max infinito como valor por defecto
}




//Checkeamos el inventario a partir de la id del producto que es un numero
//Devolvemos un objeto con el ok, la id que se busco o null si no se encuentra y el estado de stock si se encuentra
export function checkInventory(prodId: number): { ok: boolean; prodId: number | null; data?: StockStatus } {
    //Buscamos el producto en la lista por id
  const producto = dbProducts.find((productoABuscar) => productoABuscar.id === prodId);

  // si no existe retornamos el objeto con un ok en false pe
  if (!producto) {
    return { 
      ok: false, //No se encontro
      prodId: prodId , //La id que se buscaba
      data: undefined // El estado del stock osea indefinido
    };
  }


  const stockStatus: StockStatus = determinarStatusStock(producto.stock);

  // Retornamos el resultado estructurado correctamente
  return {
    ok: true, //Si se encontro
    prodId: producto.id, //Id del producto encontrado
    data: stockStatus // Estado de stock del tipo StockStatus
  };
}


//Funcion para determinar el statuck del stock gracias a los intervalos que creamos
function determinarStatusStock(stock: number): StockStatus {
//Buscamos a que intervalo de stock pertenece y le damos status
  const limite = Object.values(limiteDeInventario)
    .find((limiteABuscar) => stock <= limiteABuscar.max) || limiteDeInventario.ALTO;//Alto por defecto

//Retornamos el status
  return {
    status: limite.status,
    color: limite.color,
    alerta: limite.alerta
  };
}
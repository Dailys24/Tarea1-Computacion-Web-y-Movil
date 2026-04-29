  import {dbProducts} from "../../db/dbProducts.ts";
  import {dbUsers} from "../../db/dbUsuers.ts";
interface InterfaceCB{
  ok: boolean;
  msg: string;
  data: any;
}

interface CarritoItem {
  prodId: number;
  cantidad: number;
  addedAt: Date;
}
export function añadirAlCarrito(idProducto: number, cantidad: number, idUsuario: number): InterfaceCB {

    // revisar que el producto exista, este activo, tenga stock y que el usuario exista
    const foundProd = dbProducts.find((p) => p.id === idProducto);
    const foundUser = dbUsers.find((u) => u.id === idUsuario);


    if (foundProd == null) {
      return { ok: false, msg: "producto no encontrado", data: null };
    }
    if (foundProd.activo == false) {
      return { ok: false, msg: "producto no disponible", data: null };
    }
    if (foundProd.stock < cantidad) {
      return { ok: false, msg: "stock insuficiente", data: null };
    }
    if (foundUser == null) {
      return { ok: false, msg: "usuario no encontrado", data: null };
    }

    const itemEnCarrito = foundUser.carrito.find((producto) => producto.prodId === idProducto);
    // revisar si ya esta en el carrito
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
      } else {
  // Caso: No existe -> Añadir nuevo objeto
      let itemCreado: CarritoItem = {
        prodId: idProducto,
        cantidad: cantidad,
        addedAt: new Date()
      }
      foundUser.carrito.push(
        itemCreado
      );
}

    // calcular total del carrito
    const productoMap = new Map(dbProducts.map(producto => [producto.id, producto]));
    let total = 0;
    foundUser.carrito.forEach((item) => {
      const producto = productoMap.get(item.prodId);
    if (producto) {
    total += producto.prec * item.cantidad;
    }
    });


    return { ok: true, msg: "producto agregado al carrito", data: { carrito: foundUser.carrito, total: total } };
  }

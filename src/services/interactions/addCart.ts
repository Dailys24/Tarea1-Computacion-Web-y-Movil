interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

if (action === "addCart") {
  const prodId: number = dat;
  const qty: number = extraDat;
  const userId2: number = moreData;

  // Búsqueda de productos y usuario
  // Usamos un tipo genérico para asegurar que los elementos encontrados tienen la estructura correcta
  const foundProd = dbProducts.find((p) => p.id === prodId);
  const foundUser = dbUsers.find((u) => u.id === userId2);

  // validaciones
  if (!foundProd) {
    return cb({ ok: false, msg: "producto no encontrado", data: null });
  }
  if (!foundProd.activo) {
    return cb({ ok: false, msg: "producto no disponible", data: null });
  }
  if (foundProd.stock < qty) {
    return cb({ ok: false, msg: "stock insuficiente", data: null });
  }
  if (!foundUser) {
    return cb({ ok: false, msg: "usuario no encontrado", data: null });
  }

  // si ya existe en el carrito sumamos, si no lo agregamos
  const cartItem = foundUser.carrito.find((item) => item.prodId === prodId);

  if (cartItem) {
    cartItem.qty += qty;
  } else {
    foundUser.carrito.push({ prodId, qty, addedAt: new Date() });
  }



  // calculamos el total con un diccionario para evitar el for anidado (O(n+m))
  const catalogoProductos = new Map<number, Product>(
    dbProducts.map((p) => [p.id, p])
  );

  const total = foundUser.carrito.reduce((suma, item) => {
    const producto = catalogoProductos.get(item.prodId);
    // Validación defensiva: si el producto ya no existe en el catálogo (borrado), no suma
    return suma + (producto ? producto.precio * item.qty : 0);
  }, 0);

  return cb({
    ok: true,
    msg: "producto agregado al carrito", S
    data: { carrito: foundUser.carrito, total },
  });
}

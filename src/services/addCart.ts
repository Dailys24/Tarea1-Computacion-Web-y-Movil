if (action === "addCart") {
  const prodId: number = dat;
  const qty: number = extraDat;
  const userId2: number = moreData;

  const foundProd = dbProducts.find((p: any) => p.id === prodId);
  const foundUser = dbUsers.find((u: any) => u.id === userId2);

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
  const cartItem = foundUser.carrito.find((item: any) => item.prodId === prodId);

  if (cartItem) {
    cartItem.qty += qty;
  } else {
    foundUser.carrito.push({ prodId, qty, addedAt: new Date() });
  }

  // calculamos el total con un diccionario para evitar el for anidado (O(n+m))
  const catalogoProductos: Record<number, any> = dbProducts.reduce((mapa: any, p: any) => {
    mapa[p.id] = p;
    return mapa;
  }, {});

  const total: number = foundUser.carrito.reduce((suma: number, item: any) => {
    const producto = catalogoProductos[item.prodId];
    return suma + (producto ? producto.prec * item.qty : 0);
  }, 0);

  return cb({
    ok: true,
    msg: "producto agregado al carrito",
    data: { carrito: foundUser.carrito, total },
  });
}

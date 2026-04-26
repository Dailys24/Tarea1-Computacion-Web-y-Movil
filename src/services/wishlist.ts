//quizas cambiar nombre de variables para que sea mas claro
//agg lo de la id, preguntas si dejar o quitar
function wishlist(action2: any, userId4: any, prodId2?: any) {
  var dbUsers2 = [
    { id: 1, wishlist: [101, 103] },
    { id: 2, wishlist: [102, 104, 105] },
    { id: 3, wishlist: [] },
    { id: 4, wishlist: [101] },
    { id: 5, wishlist: [103, 107, 108] },
  ];
  // Validar id de usuario (entero positivo)
  var userIdNum = Number(userId4);
  if (!isFinite(userIdNum) || Math.floor(userIdNum) !== userIdNum || userIdNum <= 0) {
    return { ok: false, msg: "id de usuario invalido" }}
  var foundUser3: any = null;
  for (var i = 0; i < dbUsers2.length; i++) {
    if (dbUsers2[i].id === userIdNum) {
      foundUser3 = dbUsers2[i];
      break;
    }}

  if (foundUser3 == null) {
    return { ok: false, msg: "usuario no encontrado" }}
  // Agregar producto (si ya estaba, error y no se duplica)
  if (action2 == "add") {
    var idProductoNum = Number(prodId2);
    if (!isFinite(idProductoNum) || Math.floor(idProductoNum) !== idProductoNum || idProductoNum <= 0) {
      return { ok: false, msg: "id de producto invalido" }}

    for (var j = 0; j < foundUser3.wishlist.length; j++) {
      if (Number(foundUser3.wishlist[j]) === idProductoNum) {
        return { ok: false, msg: "producto ya en wishlist" }}
    }

    foundUser3.wishlist.push(idProductoNum);
    return { ok: true, msg: "agregado a wishlist", wishlist: foundUser3.wishlist }}
  // Sacar un producto de la wishlist
  if (action2 == "remove") {
    var idProductoNum2 = Number(prodId2);
    if (!isFinite(idProductoNum2) || Math.floor(idProductoNum2) !== idProductoNum2 || idProductoNum2 <= 0) {
      return { ok: false, msg: "id de producto invalido" }}
    // Buscar el producto en la wishlist
    var indiceProducto = -1;
    for (var k = 0; k < foundUser3.wishlist.length; k++) {
      if (Number(foundUser3.wishlist[k]) === idProductoNum2) {
        indiceProducto = k;
        break;
      }}

    if (indiceProducto == -1) {
      return { ok: false, msg: "producto no en wishlist" }}

    foundUser3.wishlist.splice(indiceProducto, 1);
    return { ok: true, msg: "removido de wishlist", wishlist: foundUser3.wishlist }}
  // Devolver la wishlist tal cual (sin modificarla)
  if (action2 == "get") {
    return { ok: true, wishlist: foundUser3.wishlist }}
  return { ok: false, msg: "accion no reconocida" };
}

export { wishlist };

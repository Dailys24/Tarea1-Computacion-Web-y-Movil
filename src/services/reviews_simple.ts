function reviews(action3: any, prodId3: any, userId5: any, rating2: any, comment: any, data4: any) {
  var dbReviews = [
    { id: 1, prodId: 101, userId: 2, rating: 5, comment: "Excelente laptop!", date: "2023-08-01", likes: 10, verified: true },
    { id: 2, prodId: 101, userId: 3, rating: 4, comment: "Muy buena pero cara", date: "2023-08-15", likes: 5, verified: true },
    { id: 3, prodId: 102, userId: 1, rating: 4, comment: "Buen mouse", date: "2023-09-01", likes: 2, verified: false },
    { id: 4, prodId: 103, userId: 5, rating: 5, comment: "El mejor teclado que he tenido", date: "2023-09-15", likes: 15, verified: true },
    { id: 5, prodId: 104, userId: 2, rating: 4, comment: "Monitor increible", date: "2023-10-01", likes: 8, verified: true },
  ];
  // Buscar indice de review por id (se usa en like y delete).
  function buscarIdxReview(reviewId: any) {
    for (var i = 0; i < dbReviews.length; i++) {
      if (dbReviews[i].id == reviewId) {
        return i}
    }
    return -1;
  }
  // Obtener comentarios de un producto.
  if (action3 == "getAll") {
    var revs: any[] = [];
    for (var j = 0; j < dbReviews.length; j++) {
      if (dbReviews[j].prodId == prodId3) {
        revs.push(dbReviews[j])}
    }
    return { ok: true, reviews: revs, count: revs.length }}
  // Agregar review.
  if (action3 == "add") {
    var compro = false;
    var newReview = { id: dbReviews.length + 1, prodId: prodId3, userId: userId5, rating: rating2, comment: comment, date: new Date().toISOString().split("T")[0], likes: 0, verified: compro };
    dbReviews.push(newReview);
    return { ok: true, review: newReview }}
  // Like limpio: encontrar una vez y sumar.
  if (action3 == "like") {
    var idxLike = buscarIdxReview(data4);
    if (idxLike == -1) {
      return { ok: false, msg: "review no encontrada" }}
    dbReviews[idxLike].likes = dbReviews[idxLike].likes + 1;
    return { ok: true, likes: dbReviews[idxLike].likes }}
  // Delete usando la misma busqueda.
  if (action3 == "delete") {
    var idxDelete = buscarIdxReview(data4);
    if (idxDelete == -1) {
      return { ok: false, msg: "review no encontrada o no autorizado" }}
    if (dbReviews[idxDelete].userId != userId5) {
      return { ok: false, msg: "review no encontrada o no autorizado" }}
    dbReviews.splice(idxDelete, 1);
    return { ok: true, msg: "review eliminada" }}
  return { ok: false, msg: "accion invalida" }
}

export { reviews };

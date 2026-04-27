Interacciones: notificaciones, wishlist, reviews

NOTIFICACIONES
sendNotif(tipo, userId, msg, data):
Canales tipo: email | sms | push | inapp
OK: { tipo, userId, msg, data, sentAt, ok: true }
Mal tipo: { tipo, userId, msg, data, sentAt, ok: false, err: tipo no reconocido }

notifyUser(channel, uid, message, payload):
Mismos canales que sendNotif
OK: { channel, uid, message, payload, timestamp, success: true }
Mal canal: { channel, uid, message, payload, timestamp, success: false, error: canal no valido }
Nota: hace lo mismo que sendNotif, pero con nombres de campos distintos

WISHLIST
wishlist(action2, userId4, prodId2):
add: agrega prodId2 al usuario userId4
OK: { ok: true, msg: agregado a wishlist, wishlist: [...] }
Error duplicado: producto ya en wishlist
remove: quita prodId2
OK: { ok: true, msg: removido de wishlist, wishlist: [...] }
Error si no esta: producto no en wishlist
get: devuelve { ok: true, wishlist: [...] }
Error usuario: usuario no encontrado
Error accion: accion no reconocida

REVIEWS
reviews(action3, prodId3, userId5, rating2, comment, data4):
getAll: filtra por prodId3 y devuelve reviews + count
add: usa prodId3, userId5, rating2 y comment; devuelve la review nueva
like: data4 = id de la review; suma likes
delete: userId5 intenta borrar y data4 es el id de la review; solo puede borrar el autor
Error like: review no encontrada
Error delete: review no encontrada o no autorizado
Error accion: { ok: false, msg: accion invalida }
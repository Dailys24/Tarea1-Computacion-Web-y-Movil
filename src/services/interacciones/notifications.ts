function sendNotification(tipo: any, userId: any, msg: any, data: any) {
  var fecha = new Date();
  if (tipo == "email") {
    console.log("Enviando email a usuario " + userId + ": " + msg);
    return { tipo: tipo, userId: userId, msg: msg, data: data, sentAt: fecha, ok: true }}
  if (tipo == "sms") {
    console.log("Enviando SMS a usuario " + userId + ": " + msg);
    return { tipo: tipo, userId: userId, msg: msg, data: data, sentAt: fecha, ok: true }}
  if (tipo == "push") {
    console.log("Enviando push a usuario " + userId + ": " + msg);
    return { tipo: tipo, userId: userId, msg: msg, data: data, sentAt: fecha, ok: true }}
  if (tipo == "inapp") {
    console.log("Guardando notif para usuario " + userId + ": " + msg);
    return { tipo: tipo, userId: userId, msg: msg, data: data, sentAt: fecha, ok: true }}
  return { tipo: tipo, userId: userId, msg: msg, data: data, sentAt: fecha, ok: false, err: "tipo no reconocido" }
}

function sendNotif(tipo: any, userId: any, msg: any, data: any) {
  return sendNotification(tipo, userId, msg, data)}

function notifyUser(channel: any, uid: any, message: any, payload: any) {
  var r = sendNotification(channel, uid, message, payload);
  var notif: any = { channel: r.tipo, uid: r.userId, message: r.msg, payload: r.data, timestamp: r.sentAt, success: r.ok };
  if (r.ok == false) {
    notif.error = r.err}
  return notif
}

export { sendNotification, sendNotif, notifyUser };

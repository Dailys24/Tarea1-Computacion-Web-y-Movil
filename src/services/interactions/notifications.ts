import type {InterfaceCB} from "../../utils/interfaces/interfaces.ts"

export function sendNotification(
  tipo: "email" | "sms" | "push" | "inapp",
  userId: string | number,
  msg: string,
  data: any
): InterfaceCB {
  const fecha = new Date();

  // Validación inicial: Si el tipo no es válido, devolver error inmediatamente
  if (!["email", "sms", "push", "inapp"].includes(tipo)) {
    return {ok: false, msg: "Tipo de notificación no reconocido",
       data: { tipo, userId, msg, data, sentAt: fecha, ok: false, err: "tipo no reconocido" }};

  }

  // Lógica de "envío" (simulada con log)
  console.log(`Enviando ${tipo} a usuario ${userId}: ${msg}`);

  // Construcción de la respuesta base
  const response = {
    tipo,
    userId,
    msg,
    data,
    sentAt: fecha,
    ok: true // Asumimos éxito si no hay error de tipo
  };

  return {ok: true, msg: "Notificación enviada correctamente", data: response};
}
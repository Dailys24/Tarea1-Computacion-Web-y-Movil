import { dbUsers, type Usuario } from "../db/dbUsuers.ts";

// Devuelve la referencia al usuario en la DB (NO una copia), porque varias
// operaciones (carrito, checkout, login) necesitan mutar el registro.
export function buscarUsuarioPorId(userId: number): Usuario | null {
  return dbUsers.find((u) => u.id === userId) ?? null;
}
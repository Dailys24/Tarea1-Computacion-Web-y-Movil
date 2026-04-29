import { dbUsers } from '../db/dbUsuers.ts';


export function buscarUsuarioPorId(userId: number): any | null {
  let usuario = dbUsers.find((u) => u.id === userId) || null;
  if (!usuario) {
    return null; // Retorna null si no se encuentra el usuario
  }
  return { ...usuario }; // Retorna una copia para evitar mutaciones externas
}


const user = buscarUsuarioPorId(2);

console.log("Usuario encontrado:", user);

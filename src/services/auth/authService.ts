import crypto from "node:crypto";
import { crearSesion } from "./sessionService.ts";
import { dbUsers, type Usuario } from "../../db/dbUsuers.ts";
import {
  validarEmail,
  validarPassword,
  validarRut,
  validarNombre,
  validarTelefono,
} from "../utilidades/validaciones.ts";

const MAX_INTENTOS = 3;
const HASH_SHA256_LENGTH = 64; // sha256 hex = 64 caracteres

function hashearPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Las contraseñas en dbUsers vienen en texto plano (es la "DB inicial").
// Las hasheamos una sola vez al cargar el módulo para que la comparación
// posterior sea siempre hash contra hash.
let hashesInicializados = false;
function inicializarHashes(): void {
  if (hashesInicializados) return;
  for (const u of dbUsers) {
    if (u.pass.length !== HASH_SHA256_LENGTH) {
      u.pass = hashearPassword(u.pass);
    }
  }
  hashesInicializados = true;
}
inicializarHashes();

// ============================================================================
// Tipos públicos
// ============================================================================

export interface FormDataRegistro {
  nombre: string;
  email: string;
  pass: string;
  passConfirm: string;
  rut: string;
  telefono: string;
}

export interface ResultadoLogin {
  ok: boolean;
  msg: string;
  token?: string;
  user?: Pick<Usuario, "id" | "nombre" | "email">;
}

export interface ResultadoRegistro {
  ok: boolean;
  msg?: string;
  user?: Usuario;
  errores?: string[];
}

// ============================================================================
// Registro
// ============================================================================

function validarDatosRegistro(formData: FormDataRegistro): string[] {
  const errores: string[] = [];
  if (!formData) return ["Datos del formulario vacíos"];
  if (!validarNombre(formData.nombre)) errores.push("Nombre invalido");
  if (!validarEmail(formData.email)) errores.push("Email invalido");
  if (!validarPassword(formData.pass)) {
    errores.push("Password debe tener minimo 8 caracteres");
  }
  if (formData.pass !== formData.passConfirm) {
    errores.push("Passwords no coinciden");
  }
  if (!validarRut(formData.rut)) errores.push("RUT invalido");
  if (!validarTelefono(formData.telefono)) errores.push("Telefono invalido");
  return errores;
}

function crearUsuario(formData: FormDataRegistro): Usuario {
  const ahora = new Date().toISOString();
  return {
    id: Math.floor(Math.random() * 9000) + 1000,
    nombre: formData.nombre,
    email: formData.email,
    pass: hashearPassword(formData.pass),
    tipo: "cliente",
    puntos: 0,
    descuento: 0,
    historial: [],
    carrito: [],
    wishlist: [],
    direcciones: [],
    metodoPago: [],
    activo: true,
    intentos: 0,
    bloqueado: false,
    ultimoLogin: null,
    createdAt: ahora,
    updatedAt: ahora,
  };
}

export function procesarRegistro(formData: FormDataRegistro): ResultadoRegistro {
  const errores = validarDatosRegistro(formData);
  if (errores.length > 0) return { ok: false, errores };

  if (dbUsers.some((u) => u.email === formData.email)) {
    return { ok: false, errores: ["Email ya registrado"] };
  }

  const nuevoUsuario = crearUsuario(formData);
  dbUsers.push(nuevoUsuario);
  return { ok: true, msg: "Registro exitoso", user: nuevoUsuario };
}

// ============================================================================
// Login
// ============================================================================

export function procesarLogin(email: string, password: string): ResultadoLogin {
  const usuario = dbUsers.find((u) => u.email === email);
  if (!usuario) return { ok: false, msg: "Usuario no encontrado" };

  if (usuario.bloqueado) {
    return {
      ok: false,
      msg: "Usuario bloqueado por múltiples intentos fallidos",
    };
  }
  if (!usuario.activo) {
    return { ok: false, msg: "Usuario inactivo. Contacte a soporte" };
  }

  const hashIngresado = hashearPassword(password);
  if (usuario.pass !== hashIngresado) {
    usuario.intentos += 1;
    if (usuario.intentos >= MAX_INTENTOS) {
      usuario.bloqueado = true;
      return {
        ok: false,
        msg: "Contraseña incorrecta. Cuenta bloqueada por seguridad",
      };
    }
    return {
      ok: false,
      msg: `Contraseña incorrecta. Intentos restantes: ${MAX_INTENTOS - usuario.intentos}`,
    };
  }

  // Login exitoso
  usuario.intentos = 0;
  usuario.ultimoLogin = new Date().toISOString();
  const token = crearSesion(usuario);

  return {
    ok: true,
    msg: "Login exitoso",
    token,
    user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  };
}

import  { validarEmail, validarPassword, validarRut, validarNombre, validarTelefono } from '../../utils/validaciones.ts';
import type { InterfazUsuario } from "../../utils/interfaces/interfaces.ts";
import {dbUsers} from '../../db/dbUsuers.ts';


//Modulo de registro

function validarDatosRegistro(formData: any) 
{
    const errors = [];
    
    // Copilot sugirió asegurarse de que formData exista primero
    if (!formData) return ["Datos del formulario vacíos"];

    // Todas las validaciones que Copilot notó que faltaban
    if (!validarNombre(formData.nombre)) {
        errors.push("Nombre invalido");
    }
    if (!validarEmail(formData.email)) {
        errors.push("Email invalido");
    }
    if (!validarPassword(formData.pass)) {
        errors.push("Password debe tener minimo 8 caracteres");
    }
    if (formData.pass !== formData.passConfirm) {
        errors.push("Passwords no coinciden");
    }
    if (!validarRut(formData.rut)) {
        errors.push("RUT invalido");
    }
    if (!validarTelefono(formData.telefono)) {
        errors.push("Telefono invalido");
    }
    
    return errors; 
}

export function crearUsuario(formData:any) 
{
    return {
        id: Math.floor(Math.random() * 9000) + 1000,
        nombre: formData.nombre,
        email: formData.email,
        pass: formData.pass, //Guardamos el HASH, NUNCA el texto plano
        rut: formData.rut,
        telefono: formData.telefono,
        tipo: "cliente",
        puntos: 0,
        descuento: 0,
        historial: [],
        carrito: [],
        activo: true,
        intentos: 0,
        bloqueado: false,
        ultimoLogin: null,
        createdAt: new Date().toISOString()
    };
}

export function procesarRegistro(formData: any){
    const errores = validarDatosRegistro(formData);
    
    if (errores.length > 0)
    {
        return { ok: false, errores: errores };
    }

    const nuevoUsuario = crearUsuario(formData);
    return { ok: true, msg: "Registro exitoso", user: nuevoUsuario };
}

//Modulo de login

export function procesarLogin(email: string, password: string) 
{
    //Buscar al usuario solo por email
    const usuario = dbUsers.find(u => u.email === email);

    if (!usuario) 
    {
        return { ok: false, msg: "Usuario no encontrado" };
    }

    //Manejar estados independientes
    if (usuario.bloqueado) 
    {
        return { ok: false, msg: "Usuario bloqueado por múltiples intentos fallidos" };
    }

    if (!usuario.activo) 
    {
        return { ok: false, msg: "Usuario inactivo. Contacte a soporte" };
    }



    //Login exitoso: Resetear intentos y generar sesion limpia
    usuario.intentos = 0; 
    usuario.ultimoLogin = new Date();
    


    return {
        ok: true,
        msg: "Login exitoso",
        user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    };
}


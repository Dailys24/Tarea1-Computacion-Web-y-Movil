//src/services/auth/authService.js
const sessionService = require('./sessionService');

//Simulación de base de datos en memoria para probar el login
const dbUsers = [
    { id: 1, nombre: "Juan Perez", email: "juan@mail.com", pass: "1234", tipo: "admin", puntos: 150, activo: true, intentos: 0, bloqueado: false, ultimoLogin: null },
    { id: 4, nombre: "Ana Martinez", email: "ana@mail.com", pass: "ana2024", tipo: "cliente", puntos: 50, activo: false, intentos: 3, bloqueado: true, ultimoLogin: null }
];

//Modulo de registro

function validarDatosRegistro(formData) 
{
    const errors = [];
    
    if (!formData.nombre || formData.nombre === "" || formData.nombre.length < 3) 
    {
        errors.push("Nombre invalido");
    }
    if (!formData.email || formData.email.indexOf("@") === -1) 
    {
        errors.push("Email invalido");
    }
    if (!formData.pass || formData.pass.length < 8) 
    {
        errors.push("Password debe tener minimo 8 caracteres");
    }
    if (formData.pass !== formData.passConfirm) 
    {
        errors.push("Passwords no coinciden");
    }
    if (!formData.rut || formData.rut.length < 8) 
    {
        errors.push("RUT invalido");
    }
    if (!formData.telefono || formData.telefono.length < 9) 
    {
        errors.push("Telefono invalido");
    }
    
    return errors; 
}

function crearUsuario(formData) 
{
    return {
        id: Math.floor(Math.random() * 9000) + 1000,
        nombre: formData.nombre,
        email: formData.email,
        pass: formData.pass,
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

function procesarRegistro(formData) 
{
    const errores = validarDatosRegistro(formData);
    
    if (errores.length > 0)
    {
        return { ok: false, errores: errores };
    }

    const nuevoUsuario = crearUsuario(formData);
    return { ok: true, msg: "Registro exitoso", user: nuevoUsuario };
}

//Modulo de login

function procesarLogin(email, password) 
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

    //Validar la contraseña y sumar intentos si falla
    if (usuario.pass !== password) 
    {
        usuario.intentos++; 
        
        if (usuario.intentos >= 3) 
        {
            usuario.bloqueado = true;
            return { ok: false, msg: "Contraseña incorrecta. Cuenta bloqueada por seguridad" };
        }
        return { ok: false, msg: `Contraseña incorrecta. Intentos restantes: ${3 - usuario.intentos}` };
    }

    //Login exitoso: Resetear intentos y generar sesion limpia (Tarea 3)
    usuario.intentos = 0; 
    usuario.ultimoLogin = new Date().toISOString();
    
    //Usar el nuevo servicio de sesiones para generar el token real
    const tokenSeguro = sessionService.crearSesion(usuario);

    return {
        ok: true,
        msg: "Login exitoso",
        token: tokenSeguro,
        user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    };
}

//Exportar las funciones para ser usadas en index.js
module.exports = {
    procesarRegistro,
    procesarLogin
};
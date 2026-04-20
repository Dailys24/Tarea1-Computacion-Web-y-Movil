//src/services/auth/authService.js
const sessionService = require('./sessionService');
const crypto = require('crypto'); //Modulo nativo de Node.js para criptografia segura

//Funcion para crear el hash de la contraseña
function hashearPassword(password) 
{
    //Usamos el algoritmo SHA-256 para transformar el texto plano
    return crypto.createHash('sha256').update(password).digest('hex');
}

//Simulacion de base de datos (ahora las contraseñas estan hasheadas)
const dbUsers = [
    { id: 1, nombre: "Juan Perez", email: "juan@mail.com", pass: hashearPassword("1234"), tipo: "admin", puntos: 150, activo: true, intentos: 0, bloqueado: false, ultimoLogin: null },
    { id: 4, nombre: "Ana Martinez", email: "ana@mail.com", pass: hashearPassword("ana2024"), tipo: "cliente", puntos: 50, activo: false, intentos: 3, bloqueado: true, ultimoLogin: null }
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
        pass: hashearPassword(formData.pass), //Guardamos el HASH, NUNCA el texto plano
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

    //Transformar la contraseña ingresada a hash para poder compararla
    const hashIngresado = hashearPassword(password);

    //Validar comparando HASH contra HASH
    if (usuario.pass !== hashIngresado) 
    {
        usuario.intentos++; 
        
        if (usuario.intentos >= 3) 
        {
            usuario.bloqueado = true;
            return { ok: false, msg: "Contraseña incorrecta. Cuenta bloqueada por seguridad" };
        }
        return { ok: false, msg: `Contraseña incorrecta. Intentos restantes: ${3 - usuario.intentos}` };
    }

    //Login exitoso: Resetear intentos y generar sesion limpia
    usuario.intentos = 0; 
    usuario.ultimoLogin = new Date().toISOString();
    
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
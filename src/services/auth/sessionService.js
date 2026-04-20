//src/services/auth/sessionService.js

//Objeto para guardar las sesiones activas y no usar variables globales
const sesionesActivas = {}; 

function crearSesion(usuario) 
{
    //Generar un token unico mezclando un random con la fecha
    const token = "tkn_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    
    //Guardar datos del usuario en el objeto usando el token como llave
    sesionesActivas[token] = {
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.tipo,
        inicio: new Date().toISOString()
    };
    
    return token;
}

function obtenerSesion(token) 
{
    //Retornar la sesion si existe o null si no existe
    return sesionesActivas[token] || null;
}

function cerrarSesion(token) 
{
    if (sesionesActivas[token]) 
    {
        //Eliminar la sesion del objeto de forma limpia
        delete sesionesActivas[token]; 
        return true;
    }
    return false;
}

//Exportar las funciones de gestion de sesion
module.exports = {
    crearSesion,
    obtenerSesion,
    cerrarSesion
};
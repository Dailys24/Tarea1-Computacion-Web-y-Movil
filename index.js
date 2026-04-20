//index.js
const authService = require('./src/services/auth/authService');
const sessionService = require('./src/services/auth/sessionService');

console.log("=== PRUEBA DE REGISTRO Y LOGIN CON SESIONES ===");

//Prueba de registro
const datosRegistro = {
    nombre: "Angelo",
    email: "angelo@utem.cl",
    pass: "12345678",
    passConfirm: "12345678",
    rut: "12345678-9",
    telefono: "912345678"
};
console.log("Registro:", authService.procesarRegistro(datosRegistro));

//Prueba de login exitoso para generar sesion
const resultadoLogin = authService.procesarLogin("juan@mail.com", "1234");
console.log("\nResultado Login Juan:", resultadoLogin);

if (resultadoLogin.ok) 
{
    const elToken = resultadoLogin.token;

    //Probar que podemos obtener los datos de la sesion usando el token
    const datosSesion = sessionService.obtenerSesion(elToken);
    console.log("\nDatos recuperados de la sesion:", datosSesion);

    //Probar cerrar la sesion
    console.log("\nCerrando sesion...");
    sessionService.cerrarSesion(elToken);

    //Verificar que la sesion ya no existe
    const sesionFinal = sessionService.obtenerSesion(elToken);
    console.log("Estado de sesion despues de cerrar (debe ser null):", sesionFinal);
}

//Pruebas del resto del equipo
console.log("\n=== PRUEBA DE BLOQUEOS ===");

//Simulacion a juan perez equivocandose de clave 3 veces
console.log("Intento 1:", authService.procesarLogin("juan@mail.com", "claveMala"));
console.log("Intento 2:", authService.procesarLogin("juan@mail.com", "pepito"));
console.log("Intento 3 (Bloqueo):", authService.procesarLogin("juan@mail.com", "123"));

//Juan perez intenta entrar con su clave real (1234), pero ya esta bloqueado
console.log("\nIntento Juan (Clave correcta, pero tarde):", authService.procesarLogin("juan@mail.com", "1234"));
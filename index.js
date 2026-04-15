//index.js
const authService = require('./src/services/auth/authService');

console.log("=== PRUEBA DE REGISTRO ===");
const datosDePrueba = {
    nombre: "juan",
    email: "juan@utem.cl",
    pass: "12345678",
    passConfirm: "12345678",
    rut: "12345678-9",
    telefono: "912345678"
};
const resultadoRegistro = authService.procesarRegistro(datosDePrueba);
console.log(resultadoRegistro);

console.log("\nPrueba de login");

//Simulacion a juan perez equivocándose de clave 3 veces
console.log("Intento 1:", authService.procesarLogin("juan@mail.com", "claveMala"));
console.log("Intento 2:", authService.procesarLogin("juan@mail.com", "pepito"));
console.log("Intento 3 (¡Bloqueo!):", authService.procesarLogin("juan@mail.com", "123"));

//Ana Martinez ya estaba bloqueada en la base de datos
console.log("\nCuenta Ana:", authService.procesarLogin("ana@mail.com", "ana2024"));

//Juan perez intenta entrar con su clave real (1234), pero ya está bloqueado
console.log("\nIntento Juan (Clave correcta, pero tarde):", authService.procesarLogin("juan@mail.com", "1234"));

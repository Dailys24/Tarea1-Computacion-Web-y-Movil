//index.js
const authService = require('./src/services/auth/authService');

const datosDePrueba = {
    nombre: "Juan",
    email: "juan@utem.cl",
    pass: "12345678",
    passConfirm: "12345678",
    rut: "12345678-9",
    telefono: "912345678"
};

//Ejecutar funcion
const resultado = authService.procesarRegistro(datosDePrueba);

//Imprimir resultado
console.log("Iniciando prueba de modularización");
console.log("Resultado del registro:", resultado);
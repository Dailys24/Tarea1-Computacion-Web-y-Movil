import promptSync from 'prompt-sync';
const prompt = promptSync();

import { procesarLogin, procesarRegistro } from "./services/auth/authService.ts";
import { buscarProductos } from "./utils/buscarProducto.ts";
import {
    agregarAlCarrito,
    quitarDelCarrito,
    verCarrito,
    comprar,
} from "./services/interactions/addCart.ts";

function leerEntero(label) {
    const valor = parseInt(prompt(label), 10);
    return Number.isFinite(valor) ? valor : NaN;
}

function leerOpcional(label) {
    const valor = prompt(label).trim();
    return valor === "" ? undefined : valor;
}

function pintarOpciones() {
    console.log("\nBienvenido al sistema de gestión de usuarios");
    console.log("1. Iniciar sesión");
    console.log("2. Registrar Usuario");
    console.log("3. Buscar Producto");
    console.log("4. Agregar al carrito");
    console.log("5. Ver carrito");
    console.log("6. Quitar del carrito");
    console.log("7. Comprar (checkout)");
    console.log("0. Salir");
}

function accionLogin() {
    const email = prompt('Ingrese email: ');
    const password = prompt('Ingrese contraseña: ');
    console.log("Resultado del login:", procesarLogin(email, password));
}

function accionRegistro() {
    const formData = {
        nombre: prompt('Ingrese nombre: '),
        email: prompt('Ingrese email: '),
        pass: prompt('Ingrese contraseña: '),
        passConfirm: prompt('Confirme contraseña: '),
        rut: prompt('Ingrese RUT: '),
        telefono: prompt('Ingrese teléfono: '),
    };
    console.log("Resultado del registro:", procesarRegistro(formData));
}

function accionBuscarProducto() {
    const priceMinRaw = prompt('Precio mínimo (opcional): ');
    const priceMaxRaw = prompt('Precio máximo (opcional): ');

    const filtros = {
        query: leerOpcional('Término de búsqueda (opcional): '),
        category: leerOpcional('Categoría (opcional): '),
        priceMin: priceMinRaw.trim() === '' ? undefined : parseFloat(priceMinRaw),
        priceMax: priceMaxRaw.trim() === '' ? undefined : parseFloat(priceMaxRaw),
        sortBy: leerOpcional('Campo para ordenar (opcional): '),
        sortOrder: leerOpcional('Orden (asc o desc, opcional): '),
    };

    const resultados = buscarProductos(filtros);
    console.log(`Se encontraron ${resultados.length} producto(s):`);
    resultados.forEach((p) =>
        console.log(`  [${p.id}] ${p.nom} - $${p.prec} - stock ${p.stock}`),
    );
}

function accionAgregarCarrito() {
    const userId = leerEntero('ID de usuario: ');
    const prodId = leerEntero('ID de producto: ');
    const qty = leerEntero('Cantidad: ');
    console.log(agregarAlCarrito(userId, prodId, qty));
}

function accionVerCarrito() {
    const userId = leerEntero('ID de usuario: ');
    const r = verCarrito(userId);
    if (!r.ok) {
        console.log(r.msg);
        return;
    }
    console.log(`Total carrito: $${r.data.total}`);
    r.data.carrito.forEach((c) =>
        console.log(`  prod ${c.prodId} x ${c.qty}`),
    );
}

function accionQuitarCarrito() {
    const userId = leerEntero('ID de usuario: ');
    const prodId = leerEntero('ID de producto: ');
    console.log(quitarDelCarrito(userId, prodId));
}

function accionComprar() {
    const userId = leerEntero('ID de usuario: ');
    const metodoPago = prompt('Método de pago (tarjeta/transferencia/efectivo): ').trim();
    const direccion = prompt('Dirección de envío: ');

    const datosCompra = { userId, metodoPago, direccion };

    if (metodoPago === 'tarjeta') {
        datosCompra.datosTarjeta = {
            numero: prompt('Número de tarjeta (16 dígitos): '),
            cvv: prompt('CVV (3 dígitos): '),
            expiry: prompt('Vencimiento MM/AA: '),
        };
    }

    const r = comprar(datosCompra);
    console.log(r.msg);
    if (r.ok) {
        console.log(`Orden ${r.data.id} - total $${r.data.total.toFixed(2)} - puntos ganados: ${r.data.puntosGanados}`);
    }
}

function ejecutarOpcion(opcion) {
    switch (opcion) {
        case "1": accionLogin(); break;
        case "2": accionRegistro(); break;
        case "3": accionBuscarProducto(); break;
        case "4": accionAgregarCarrito(); break;
        case "5": accionVerCarrito(); break;
        case "6": accionQuitarCarrito(); break;
        case "7": accionComprar(); break;
        case "0": console.log("Saliendo del sistema..."); break;
        default:  console.log("Opción no reconocida"); break;
    }
}

function mostrarMenu() {
    let opcion;
    do {
        pintarOpciones();
        opcion = prompt('Seleccione una opción: ');
        ejecutarOpcion(opcion);
    } while (opcion !== "0");
}

mostrarMenu();

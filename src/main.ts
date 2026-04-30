import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });
import { procesarLogin, procesarRegistro } from "./services/auth/authService.ts";
import { buscarProductos } from "./utils/buscarProducto.ts"; // Nota: Asegúrate que la extensión sea .js o .ts según tu setup
import { añadirAlCarrito } from "./services/interactions/addCart.ts";
import { procesarPago } from "./services/calc/pagos.ts";
import { getStats } from "./services/interactions/estadisticas.ts";
import type { InterfaceCB, InterfazRegistro } from "./utils/interfaces/interfaces.ts";
import {sendNotification} from "./services/interactions/notifications.ts"




/**
 * Función principal para mostrar el menú y gestionar la lógica del ciclo
 */
function mostrarMenu(): void {
    // Se declara como string para el switch-case
    let opcion: string = "1"; // Inicializamos con un valor válido para evitar errores
    console.log("Bienvenido al sistema de gestión de usuarios");

    // Prompt-sync devuelve strings, así que opcion será string desde el inicio
    do {
        console.log("Bienvenido al sistema de gestión de usuarios");
        console.log("1.Iniciar sesión");
        console.log("2.Registrar Usuario");
        console.log("3.Buscar Producto");
        console.log("4.Agregar al carrito");
        console.log("5.Realizar compra");
        console.log("6.Ver estadísticas");
        console.log("7.Enviar notificación");
        console.log("0.Salir");
        

        const inputOpcion = prompt('Seleccione una opción: ');
        opcion = inputOpcion as string; 
        switch(opcion) {
         
      case "1":
            const email = prompt('Ingrese email: ');
            const password = prompt('Ingrese contraseña: ');
            // Asumimos que procesarLogin devuelve un ResultadoCB o similar
            const resultadoLogin = procesarLogin(email, password) as InterfaceCB; 
            console.log("Resultado del login:", resultadoLogin);
            break;

        case "2":
            const formData: InterfazRegistro = {
                nombre: prompt('Ingrese nombre: '),
                email: prompt('Ingrese email: '),
                pass: prompt('Ingrese contraseña: '),
                passConfirm: prompt('Confirme contraseña: '),
                rut: prompt('Ingrese RUT: '),
                telefono: prompt('Ingrese teléfono: ')
            };

            const resultadoRegistro = procesarRegistro(formData);
            console.log("Resultado del registro:", resultadoRegistro);
            break;

        case "3":
            const busqueda = {
                query: prompt('Ingrese el término de búsqueda: (opcional) '),
                category: prompt('Ingrese la categoría (opcional): '),
                priceMin: parseFloat(prompt('Ingrese el precio mínimo (opcional): ')),
                priceMax: parseFloat(prompt('Ingrese el precio máximo (opcional): ')),
                sortBy: prompt('Ingrese el campo para ordenar (opcional): '),
                sortOrder: prompt('Ingrese el orden (asc o desc, opcional): ')
            }
            const resultadosBusqueda = buscarProductos(busqueda);
            console.log("Resultados de la búsqueda:", resultadosBusqueda);
            break;

        case "4":
            let idProducto = parseInt(prompt('Ingrese el ID del producto a agregar al carrito: '));
            let cantidad = parseInt(prompt('Ingrese la cantidad: '));
            let idUsuario = parseInt(prompt('Ingrese su ID de usuario: '));
            const resultadoAgregarCarrito = añadirAlCarrito(idProducto, cantidad, idUsuario);
            console.log("Resultado de agregar al carrito:", resultadoAgregarCarrito);
            if (resultadoAgregarCarrito && 'data' in resultadoAgregarCarrito) {
                console.log("Datos del carrito:", resultadoAgregarCarrito.data);
            }
            break;

        case "5":
            let idUsuarioCompra = parseInt(prompt('Ingrese su ID de usuario: '));
            let direccionCompra = prompt('Ingrese la dirección de envío: ');
            console.log("Seleccione el método de pago:");
            console.log("1. Tarjeta de crédito");
            console.log("2. Deposito bancario");
            console.log("3. Pago en efectivo");
            let opcionMetodo = parseInt(prompt('Ingrese el número del método de pago: '));
            const resultadoPago = procesarPago(idUsuarioCompra, direccionCompra, opcionMetodo) as InterfaceCB;
            console.log("Resultado del pago:", resultadoPago);
            break;


        case "6":
            const estadisticas = getStats();
            console.log("Estadísticas:", estadisticas);
            break;
        case "7":
            const userId = prompt('Ingrese el ID del usuario: ');
            const msg = prompt('Ingrese el mensaje: ');
            const data = prompt('Ingrese los datos adicionales: (JSON)');
            const tipo = prompt('Escriba el tipo de notificación (email/sms/push/inapp): ');
            const notification = sendNotification(tipo,userId, msg, data);
            console.log("Notificación enviada:", notification);
            break;

        case "0":
            console.log("Saliendo del sistema. . .");
            break;
            
        default:
            // Opcional: Mensaje para opciones no reconocidas
            console.log("Opción no válida. Por favor seleccione del 0 al 5.");
            break;
        }
    } while (opcion !== "0");
    
    console.log("Proceso finalizado.");
}


mostrarMenu();
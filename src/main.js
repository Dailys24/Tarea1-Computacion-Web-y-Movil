import promptSync from 'prompt-sync';
const prompt = promptSync();
import {procesarLogin, procesarRegistro} from "./services/auth/authService.js";
import { buscarProductos } from "./utils/buscarProducto.ts";
import { añadirAlCarrito } from "./services/interactions/addCart.ts";




function mostrarMenu() {

    console.log("Bienvenido al sistema de gestión de usuarios");
    console.log("1.Iniciar sesión");
    console.log("2.Registrar Usuario");
    console.log("3.Buscar Producto");
    console.log("4.Agregar al carrito");
    console.log("0.Salir");
    let opcion = prompt('Seleccione una opción: ');

    do {
        switch(opcion) {
        
            case "1":
                const email = prompt('Ingrese email: ');
                const password = prompt('Ingrese contraseña: ');
                const resultadoLogin = procesarLogin(email, password);
                console.log("Resultado del login:", resultadoLogin);
                break;

            //Aclarar los requerimientos de los campos del registro, por ejemplo el largo minimo de la contra.
            case "2":
                const formData = {
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
                query: prompt('Ingrese el término de búsqueda: '),
                category: prompt('Ingrese la categoría (opcional): '),
                priceMin: parseFloat(prompt('Ingrese el precio mínimo (opcional): ')),
                priceMax: parseFloat(prompt('Ingrese el precio máximo (opcional): ')),
                sortBy: prompt('Ingrese el campo para ordenar (opcional): '),
                sortOrder: prompt('Ingrese el orden (asc o desc, opcional): ')
                }
                const resultadosBusqueda = buscarProductos(busqueda);
                console.log("Resultados de la búsqueda:", resultadosBusqueda);
                break;

            //Cambiar para no pedir el id, obtenerlo de inicio de sesion.
            case "4":
                let idProducto = parseInt(prompt('Ingrese el ID del producto a agregar al carrito: '));
                let cantidad = parseInt(prompt('Ingrese la cantidad: '));
                let idUsuario = parseInt(prompt('Ingrese su ID de usuario: '));
                const resultadoAgregarCarrito = añadirAlCarrito(idProducto, cantidad, idUsuario);
                console.log("Resultado de agregar al carrito:", resultadoAgregarCarrito);
                console.log("Datos del carrito:", resultadoAgregarCarrito.data);
                break;

            case "5":

            case "0":
                console.log("Saliendo del sistema...");
                break;
    }
    }while (opcion === "0");
}

mostrarMenu();
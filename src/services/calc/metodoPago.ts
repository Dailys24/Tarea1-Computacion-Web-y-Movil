import promptSync from 'prompt-sync';
import {validarCredito} from "../../utils/validaciones.ts";
import type {InterfaceCB} from "../../utils/interfaces/interfaces.ts";

 export function metodoPago(opcion:number): InterfaceCB{
 
    if (opcion === 1) {
        //metodo tarjeta
        let tarjeta = prompt("Ingrese el número de su tarjeta (16 dígitos): ");
        let cvv = prompt("Ingrese el CVV de su tarjeta (3 dígitos): ");
         return validarCredito(tarjeta, cvv);
    }
    else {
        //metodo transferencia
        return { ok: true, msg: "Pago Realizado Con exito", data: null };
    }

 }

import { formatearPrecio } from "../utilidades/formatearPrecio.js";
import { formateaEstrellasRating } from "../utilidades/formateaEstrellasRating.js";
import {interfazProducto} from "../db/dbProducts.js"




// Función principal para renderizar el componente HTML
export function renderProduct(producto: interfazProducto): string {
  //Definimos el texto a mostrar dependiendo de la disponibilidad 
  const isAgotado = producto.stock <= 0;
  const isPocoStock = producto.stock > 0 && producto.stock <= 5;
  const isDisponibilidad = producto.activo && producto.stock > 0;

  //En esta parte construimos el HTML del producto segun su info
  return `
    <div class='product-card'>
      <div class='product-img'>
        <img 
          src="${producto.imgs[0] ?? ''}" 
          alt="${producto.nom}" 
        />
        ${isAgotado ? '<div class="badge-agotado">AGOTADO</div>' : ''}
        ${isPocoStock ? `<div class="badge-poco-stock">ÚLTIMAS ${producto.stock} UNIDADES</div>` : ''}
      </div>
      
      <div class='product-info'>
        <h3>${producto.nom}</h3>
        <div class='rating'>
          ${formateaEstrellasRating(producto.rating)} (${producto.rating})  
        </div>
        <p class='desc'>${producto.desc}</p>
        <div class='price'>${formatearPrecio(producto.prec)}</div>
        <div class='category'>Categoría: ${producto.cat}</div>
        
        ${isDisponibilidad 
          ? `<button 
              data-product-id="${producto.id}" 
              class="btn-cart" 
            >
              Agregar al carrito
            </button>`
          : `<button disabled class="btn-cart-disabled">No disponible</button>`
        }
      </div>
    </div>
  `;
}
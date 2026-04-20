import { dbProducts } from '../db/dbProducts.ts';
import { interfazProducto } from '../db/dbProducts.ts';
// Interfaz que define el contenido de un producto


//Interfaz que define los filtros de busqueda
interface interfazFiltrosBusqueda {
  query?: string;
  category?: string; 
  priceMin?: number;
  priceMax?: number;
  sortBy?:keyof interfazProducto;
  sortOrder?: 'asc' | 'desc';
}


//Funcion que busca producto segun el objeto filtros
export function buscarProductos(filtros: interfazFiltrosBusqueda): interfazProducto[] {
  let productos = [...dbProducts]; // Copiamos la base de datos
  
  // 1. Filtrar por Nombre
  if (filtros.query) {
    const lowerQuery = filtros.query.toLowerCase(); //Pasamos query a minusculas
    productos = productos.filter(p => 
      typeof p.nom === 'string' && 
      p.nom.toLowerCase().includes(lowerQuery)
    );// Retormanos los productos que contegan la query, asegurando que sean strings
  }


// 2. Filtrar por Categoría
if (filtros.category) {
    // 1. Guardamos la categoría en minúsculas en una constante antes del loop.

    const categoriaABuscar = filtros.category.toLowerCase(); //Pasamos las categorias a minusculas
    productos = productos.filter(p => {
        return (
            p.cat !== undefined &&
            typeof p.cat === 'string' &&
            p.cat.toLowerCase() === categoriaABuscar
        );//Retornamos los productos que la categoría coincide exactamente osea sin Undefined ni vacio 
    });
}


  // 3. Filtrar por Precio
  // Usamos ?? para segurarnos que siempre sean un numero valido
  const minPrecioSeguro = filtros.priceMin ?? 0; // precio minimo o 0
  const maxPrecioSeguro = filtros.priceMax ?? Number.MAX_SAFE_INTEGER; // precion maximo o numero maximo seguro

  productos = productos.filter(p => 
    p.prec >= minPrecioSeguro && 
    p.prec <= maxPrecioSeguro
  ); // Filtramos por precion maximo y minimo

  // --- 4. FIltro de ordenamiento ---
  if (filtros.sortBy && typeof filtros.sortBy === 'string') {
    const sortField = filtros.sortBy;
    
    // Verificamos existencia de campo de otrdenamiento
    const exists = dbProducts.some(p => p[sortField] !== undefined);

    if (exists) {
      productos.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        const mult = filtros.sortOrder === 'desc' ? -1 : 1;
        
        // Lógica segura para ordenamiento numérico
        return (Number(valA) - Number(valB)) * mult;
      });
    }
  }

  return productos;
}

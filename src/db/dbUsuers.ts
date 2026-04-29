interface dbUserInterface {
  id: number;
  nombre: string;
  email: string;
  pass: string;
  tipo: string;
  puntos: number;
  descuento: number;
  historial: any[];
  carrito: CarritoItem[];
  wishlist: any[];
  direcciones: any[];
  metodoPago: any[];
  activo: boolean;
  intentos: number;
  bloqueado: boolean;
  ultimoLogin: Date | null;
  createdAt: string;
  updatedAt: string;
}

interface CarritoItem {
  prodId: number;
  cantidad: number;
  addedAt: Date;
}


export let dbUsers : dbUserInterface[] = [
    { id: 1, nombre: "Juan Perez", email: "juan@mail.com", pass: "1234", tipo: "admin", puntos: 150, descuento: 0, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true, intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-01-01", updatedAt: "2023-06-01" },
    { id: 2, nombre: "Maria Lopez", email: "maria@mail.com", pass: "abcd", tipo: "cliente", puntos: 80, descuento: 5, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true, intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-02-01", updatedAt: "2023-06-15" },
    { id: 3, nombre: "Pedro Gonzalez", email: "pedro@mail.com", pass: "pass123", tipo: "vendedor", puntos: 200, descuento: 10, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true, intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-03-01", updatedAt: "2023-07-01" },
    { id: 4, nombre: "Ana Martinez", email: "ana@mail.com", pass: "ana2024", tipo: "cliente", puntos: 50, descuento: 0, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: false, intentos: 3, bloqueado: true, ultimoLogin: null, createdAt: "2023-04-01", updatedAt: "2023-07-10" },
    { id: 5, nombre: "Carlos Ruiz", email: "carlos@mail.com", pass: "carlos99", tipo: "cliente", puntos: 300, descuento: 15, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true, intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-05-01", updatedAt: "2023-08-01" }
  ];
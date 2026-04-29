// Items que el usuario va agregando al carrito antes de comprar
export interface CartItem {
  prodId: number;
  qty: number;
  addedAt: Date;
}

// Item ya "congelado" dentro de una orden (al momento de comprar)
export interface OrderItem {
  prodId: number;
  nom: string;
  qty: number;
  precUnit: number;
  totalItem: number;
}

export type EstadoOrden = "pendiente" | "pagado" | "cancelado";
export type MetodoPago = "tarjeta" | "transferencia" | "efectivo";

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  descuentoPct: number;
  descuentoMonto: number;
  totalSinIva: number;
  iva: number;
  total: number;
  metodoPago: MetodoPago;
  direccion: string;
  estado: EstadoOrden;
  puntosGanados: number;
  createdAt: Date;
}

export type TipoUsuario = "admin" | "cliente" | "vendedor";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  pass: string;
  tipo: TipoUsuario;
  puntos: number;
  descuento: number;
  historial: Order[];
  carrito: CartItem[];
  wishlist: number[];
  direcciones: string[];
  metodoPago: string[];
  activo: boolean;
  intentos: number;
  bloqueado: boolean;
  ultimoLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export const dbUsers: Usuario[] = [
  { id: 1, nombre: "Juan Perez",     email: "juan@mail.com",   pass: "1234",      tipo: "admin",    puntos: 150, descuento: 0,  historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true,  intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-01-01", updatedAt: "2023-06-01" },
  { id: 2, nombre: "Maria Lopez",    email: "maria@mail.com",  pass: "abcd",      tipo: "cliente",  puntos: 80,  descuento: 5,  historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true,  intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-02-01", updatedAt: "2023-06-15" },
  { id: 3, nombre: "Pedro Gonzalez", email: "pedro@mail.com",  pass: "pass123",   tipo: "vendedor", puntos: 200, descuento: 10, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true,  intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-03-01", updatedAt: "2023-07-01" },
  { id: 4, nombre: "Ana Martinez",   email: "ana@mail.com",    pass: "ana2024",   tipo: "cliente",  puntos: 50,  descuento: 0,  historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: false, intentos: 3, bloqueado: true,  ultimoLogin: null, createdAt: "2023-04-01", updatedAt: "2023-07-10" },
  { id: 5, nombre: "Carlos Ruiz",    email: "carlos@mail.com", pass: "carlos99",  tipo: "cliente",  puntos: 300, descuento: 15, historial: [], carrito: [], wishlist: [], direcciones: [], metodoPago: [], activo: true,  intentos: 0, bloqueado: false, ultimoLogin: null, createdAt: "2023-05-01", updatedAt: "2023-08-01" },
];

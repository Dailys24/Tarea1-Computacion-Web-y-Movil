export interface InterfaceCB {
    ok: boolean;
    msg: string;
    data: any;
}

export interface InterfazRegistro {
  nombre: string;
  email: string;
  pass: string;
  passConfirm: string;
  rut: string;
  telefono: string;
}

export interface CarritoItem {
  prodId: number;
  cantidad: number;
  addedAt: Date;
}


export interface interfazProducto {
  id: number;
  nom: string;
  cat: string;
  prec: number;
  stock: number;
  desc: string;
  rating: number;
  reviews: string[]; 
  vendedor: number;
  imgs: string[];
  tags: string[];
  activo: boolean;
  createdAt: string;
}




// Interfaces para estadísticas
export interface UserStats {
  total: number;
  activos: number;
  bloqueados: number;
  admin: number;
  clientes: number;
  vendedores: number;
}

/** Interfaz para las categorías de productos */
export interface ProductCategoryStats {
  electronica: number;
  accesorios: number;
  audio: number;
  almacenamiento: number;
  componentes: number;
  muebles: number;
}

/** Interfaz completa para las estadísticas de productos */
export interface ProductStats {
  total: number;
  activos: number;
  inactivos: number;
  porCategoria: ProductCategoryStats;
  stockTotal: number;
  valorInventario: number;
}

export interface StatsData {
  usuarios: UserStats | null;
  productos: ProductStats | null;
}


export interface NotificationResult {
  tipo: "email" | "sms" | "push" | "inapp";
  userId: string | number;
  msg: string;
  data: any; // El payload puede ser cualquier dato
  sentAt: Date;
  ok: boolean;
  err?: string;
  channel?: NotificationResult["tipo"];
  uid?: NotificationResult["userId"];
  message?: string;
  payload?: any;
  timestamp?: Date;
  success?: boolean;
  error?: string;
}



//Simulacion de base de datos (ahora las contraseñas estan hasheadas)
export interface InterfazUsuario{
    id: number;
    nombre: string;
    email: string;
    pass: string;
    tipo: string;
    puntos: number;
    activo: boolean;
    intentos: number;
    bloqueado: boolean;
    ultimoLogin: Date | null;
    rut?: string;
    telefono?: string;
    descuento?: number;
    historial?: any[];
    carrito?: any[];
    createdAt?: string;
};

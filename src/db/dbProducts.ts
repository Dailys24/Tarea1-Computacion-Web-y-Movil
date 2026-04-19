//Interfaz que define los campos y los tipos que debe contener un producto 
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

//Arreglo que contiene los productos de la tienda pe
export let dbProducts: interfazProducto[] = [
  { id: 101, nom: "Laptop Pro 15", cat: "electronica", prec: 1200000, stock: 5, desc: "Laptop de alto rendimiento", rating: 4.5, reviews: [], vendedor: 3, imgs: ["img1.jpg", "img2.jpg"], tags: ["laptop", "computador", "pro"], activo: true, createdAt: "2023-01-15" },
  { id: 102, nom: "Mouse Inalambrico", cat: "accesorios", prec: 25000, stock: 50, desc: "Mouse ergonomico inalambrico", rating: 4.0, reviews: [], vendedor: 3, imgs: ["img3.jpg"], tags: ["mouse", "inalambrico"], activo: true, createdAt: "2023-01-20" },
  { id: 103, nom: "Teclado Mecanico RGB", cat: "accesorios", prec: 85000, stock: 20, desc: "Teclado mecanico con iluminacion RGB", rating: 4.8, reviews: [], vendedor: 3, imgs: ["img4.jpg", "img5.jpg"], tags: ["teclado", "mecanico", "rgb"], activo: true, createdAt: "2023-02-01" },
  { id: 104, nom: "Monitor 4K 27\"", cat: "electronica", prec: 450000, stock: 8, desc: "Monitor 4K con HDR", rating: 4.6, reviews: [], vendedor: 3, imgs: ["img6.jpg"], tags: ["monitor", "4k"], activo: true, createdAt: "2023-02-15" },
  { id: 105, nom: "Auriculares Bluetooth", cat: "audio", prec: 75000, stock: 30, desc: "Auriculares con cancelacion de ruido", rating: 4.3, reviews: [], vendedor: 3, imgs: ["img7.jpg"], tags: ["auriculares", "bluetooth"], activo: true, createdAt: "2023-03-01" },
  { id: 106, nom: "Webcam HD 1080p", cat: "accesorios", prec: 45000, stock: 15, desc: "Webcam para videoconferencias", rating: 4.1, reviews: [], vendedor: 3, imgs: ["img8.jpg"], tags: ["webcam", "camara"], activo: true, createdAt: "2023-03-15" },
  { id: 107, nom: "SSD 1TB", cat: "almacenamiento", prec: 95000, stock: 25, desc: "SSD de alta velocidad", rating: 4.7, reviews: [], vendedor: 3, imgs: ["img9.jpg"], tags: ["ssd", "almacenamiento"], activo: true, createdAt: "2023-04-01" },
  { id: 108, nom: "Memoria RAM 16GB", cat: "componentes", prec: 65000, stock: 40, desc: "RAM DDR4 3200MHz", rating: 4.4, reviews: [], vendedor: 3, imgs: ["img10.jpg"], tags: ["ram", "memoria"], activo: true, createdAt: "2023-04-15" },
  { id: 109, nom: "Silla Gamer", cat: "muebles", prec: 350000, stock: 10, desc: "Silla ergonomica para gaming", rating: 4.2, reviews: [], vendedor: 3, imgs: ["img11.jpg"], tags: ["silla", "gamer"], activo: false, createdAt: "2023-05-01" },
  { id: 110, nom: "Hub USB-C 7 en 1", cat: "accesorios", prec: 38000, stock: 60, desc: "Hub multipuerto USB-C", rating: 3.9, reviews: [], vendedor: 3, imgs: ["img12.jpg"], tags: ["hub", "usb"], activo: true, createdAt: "2023-05-15" }
];

//Aqui abajo dejo una version con los nombres completos de los campos
//quizas causaba problemas a asi que la comentare y dejare la original

//Arreglo que contiene los productos de la tienda pe
/*
export let dbProducts: Producto[] = [
  { id: 101, nombre: "Laptop Pro 15", categoria: "electronica", precio: 1200000, stock: 5, descripcion: "Laptop de alto rendimiento", rating: 4.5, reviews: [], vendedor: 3, imgs: ["img1.jpg", "img2.jpg"], tags: ["laptop", "computador", "pro"], activo: true, fechaCreacion: "2023-01-15" },
  { id: 102, nombre: "Mouse Inalambrico", categoria: "accesorios", precio: 25000, stock: 50, descripcion: "Mouse ergonomico inalambrico", rating: 4.0, reviews: [], vendedor: 3, imgs: ["img3.jpg"], tags: ["mouse", "inalambrico"], activo: true, fechaCreacion: "2023-01-20" },
  { id: 103, nombre: "Teclado Mecanico RGB", categoria: "accesorios", precio: 85000, stock: 20, descripcion: "Teclado mecanico con iluminacion RGB", rating: 4.8, reviews: [], vendedor: 3, imgs: ["img4.jpg", "img5.jpg"], tags: ["teclado", "mecanico", "rgb"], activo: true, fechaCreacion: "2023-02-01" },
  { id: 104, nombre: "Monitor 4K 27\"", categoria: "electronica", precio: 450000, stock: 8, descripcion: "Monitor 4K con HDR", rating: 4.6, reviews: [], vendedor: 3, imgs: ["img6.jpg"], tags: ["monitor", "4k"], activo: true, fechaCreacion: "2023-02-15" },
  { id: 105, nombre: "Auriculares Bluetooth", categoria: "audio", precio: 75000, stock: 30, descripcion: "Auriculares con cancelacion de ruido", rating: 4.3, reviews: [], vendedor: 3, imgs: ["img7.jpg"], tags: ["auriculares", "bluetooth"], activo: true, fechaCreacion: "2023-03-01" },
  { id: 106, nombre: "Webcam HD 1080p", categoria: "accesorios", precio: 45000, stock: 15, descripcion: "Webcam para videoconferencias", rating: 4.1, reviews: [], vendedor: 3, imgs: ["img8.jpg"], tags: ["webcam", "camara"], activo: true, fechaCreacion: "2023-03-15" },
  { id: 107, nombre: "SSD 1TB", categoria: "almacenamiento", precio: 95000, stock: 25, descripcion: "SSD de alta velocidad", rating: 4.7, reviews: [], vendedor: 3, imgs: ["img9.jpg"], tags: ["ssd", "almacenamiento"], activo: true, fechaCreacion: "2023-04-01" },
  { id: 108, nombre: "Memoria RAM 16GB", categoria: "componentes", precio: 65000, stock: 40, descripcion: "RAM DDR4 3200MHz", rating: 4.4, reviews: [], vendedor: 3, imgs: ["img10.jpg"], tags: ["ram", "memoria"], activo: true, fechaCreacion: "2023-04-15" },
  { id: 109, nombre: "Silla Gamer", categoria: "muebles", precio: 350000, stock: 10, descripcion: "Silla ergonomica para gaming", rating: 4.2, reviews: [], vendedor: 3, imgs: ["img11.jpg"], tags: ["silla", "gamer"], activo: false, fechaCreacion: "2023-05-01" },
  { id: 110, nombre: "Hub USB-C 7 en 1", categoria: "accesorios", precio: 38000, stock: 60, descripcion: "Hub multipuerto USB-C", rating: 3.9, reviews: [], vendedor: 3, imgs: ["img12.jpg"], tags: ["hub", "usb"], activo: true, fechaCreacion: "2023-05-15" }
];
*/
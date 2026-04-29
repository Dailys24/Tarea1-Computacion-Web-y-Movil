export interface InterfaceCB {
    ok: boolean;
    msg: string;
    data: any;
}

export interface CarritoItem {
  prodId: number;
  cantidad: number;
  addedAt: Date;
}
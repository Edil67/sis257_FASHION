import type { Producto } from "./producto";
import type { Venta } from "./venta";

export interface ventaDetalle {

  id:number;
  cantidad:string;
  subtotal:string;
  fechaCreacion: Date;
  venta:Venta;
  producto:Producto;
}

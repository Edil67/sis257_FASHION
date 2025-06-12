import type { Cliente } from "./cliente";
import type { Empleado } from "./empleado";
import type { Producto } from "./producto";

export interface Venta {
  id: number;

  cantidad: number;

  precioUnitario: number;

  totalVenta: number;

  fechaCreacion: Date;

  cliente: Cliente;

  producto: Producto;

  empleado: Empleado;
}

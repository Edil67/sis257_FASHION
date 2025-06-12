import type { Cliente } from './cliente'
import type { Empleado } from './empleado'
import type { ventaDetalle } from './ventaDetalle'

export interface Venta {
  id: number

  totalVenta: number

  cliente: Cliente
  empleado: Empleado
  fechaCreacion: Date
  ventaDetalles: ventaDetalle[]
}

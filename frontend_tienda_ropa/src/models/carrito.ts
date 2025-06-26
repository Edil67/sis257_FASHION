import type { Producto } from './producto'

export interface ItemCarrito {
  id: string // ID único para el item en el carrito
  producto: Producto
  cantidad: number
  subtotal: number
}

export interface Carrito {
  items: ItemCarrito[]
  total: number
  cantidadTotal: number
}

export interface DetalleVenta {
  idProducto: number
  cantidad: number
}

export interface VentaRequest {
  idCliente?: number
  idUsuario?: number
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr' | 'cotización' | 'otro'
  detalles: DetalleVenta[]
  montoPagado: number
  cambio: number
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'qr' | 'cotización' | 'otro'

export interface DatosCheckout {
  metodoPago: MetodoPago
  nombre?: string
  apellido?: string
  telefono?: string
  email?: string
  direccion?: string
  ci?: string
}

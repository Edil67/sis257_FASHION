import type { Categoria } from './categoria'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  tallasDisponibles: string
  coloresDisponibles: string
  imagenes: string
  fechaCreacion: Date

  fechaModificacion: Date

  categoria: Categoria
}

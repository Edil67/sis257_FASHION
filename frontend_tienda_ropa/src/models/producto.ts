import type { Categoria } from './categoria'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number 
  stock: number
  talla: string
  color: string
  imagenes: string
  fechaCreacion: string
  fechaModificacion: string
  fechaEliminacion: string | null
  idCategoria: number
  categoria: Categoria
}

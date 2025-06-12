import type { Usuario } from './usuario'

export interface Empleado {
  id: number
  nombres: string
  apellidos: string
  cargo: string
  usuario: Usuario
}

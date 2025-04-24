export class CreateProductoDto {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo?: boolean;
}

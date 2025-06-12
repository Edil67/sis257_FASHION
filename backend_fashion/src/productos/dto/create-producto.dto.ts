import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, {
    message: 'El campo nombre no debe ser mayor a 100 caracteres',
  })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(500, {
    message: 'El campo descripcion no debe ser mayor a 500 caracteres',
  })
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio es obligatorio' })
  @IsNumber({}, { message: 'El campo precio debe ser de tipo número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo stock es obligatorio' })
  @IsNumber({}, { message: 'El campo stock debe ser de tipo número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  readonly stock: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo talla es obligatorio' })
  @IsString({ message: 'La talla debe ser de tipo cadena' })
  readonly talla: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo color es obligatorio' })
  @IsString({ message: 'El color debe ser de tipo cadena' })
  readonly color: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo imagenes es obligatorio' })
  @IsString({ message: 'La imagen debe ser una URL válida' })
  readonly imagenes: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idCategoria es obligatorio' })
  @IsNumber({}, { message: 'El campo idCategoria debe ser de tipo número' })
  readonly idCategoria: number;
}

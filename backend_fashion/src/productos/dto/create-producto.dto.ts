import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsArray,
  IsBoolean,
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
  @IsArray({ message: 'El campo tallasDisponibles debe ser un array' })
  @IsString({ each: true, message: 'Cada talla debe ser de tipo cadena' })
  readonly tallasDisponibles: string[];

  @ApiProperty()
  @IsArray({ message: 'El campo coloresDisponibles debe ser un array' })
  @IsString({ each: true, message: 'Cada color debe ser de tipo cadena' })
  readonly coloresDisponibles: string[];

  @ApiProperty()
  @IsArray({ message: 'El campo imagenes debe ser un array' })
  @IsString({ each: true, message: 'Cada imagen debe ser una URL válida' })
  readonly imagenes: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo categoriaId es obligatorio' })
  @IsNumber({}, { message: 'El campo categoriaId debe ser de tipo número' })
  readonly categoriaId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo tipo es obligatorio' })
  @IsString({ message: 'El campo tipo debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo tipo no debe ser mayor a 50 caracteres' })
  readonly tipo: string;

  @ApiProperty()
  @IsBoolean({ message: 'El campo activo debe ser de tipo booleano' })
  readonly activo: boolean;
}

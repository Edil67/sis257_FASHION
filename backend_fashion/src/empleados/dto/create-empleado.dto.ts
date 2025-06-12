import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombres no debe ser vacío' })
  @IsString({ message: 'El campo nombres debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo nombres no debe ser mayor a 50 caracteres',
  })
  @MinLength(4, {
    message: 'El campo nombres no debe ser menor a 4 caracteres',
  })
  readonly nombres: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo apellidos no debe ser vacío' })
  @IsString({ message: 'El campo apellidos debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo apellidos no debe ser mayor a 50 caracteres',
  })
  @MinLength(4, {
    message: 'El campo apellidos no debe ser menor a 4 caracteres',
  })
  readonly apellidos: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cargo no debe ser vacío' })
  @IsString({ message: 'El campo cargo debe ser de tipo cadena' })
  @MaxLength(30, {
    message: 'El campo cargo no debe ser mayor a 30 caracteres',
  })
  @MinLength(4, { message: 'El campo cargo no debe ser menor a 4 caracteres' })
  readonly cargo: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo idUsuario debe estar definido' })
  @IsNumber({}, { message: 'El campo idUsuario debe ser de tipo numérico' })
  readonly idUsuario: number;
}

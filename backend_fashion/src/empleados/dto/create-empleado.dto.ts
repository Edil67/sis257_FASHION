import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty({
    example: 'Juan',
  })
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo nombre no debe ser mayor a 50 caracteres' })
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
  })
  @IsNotEmpty({ message: 'El campo apellido no debe ser vacío' })
  @IsString({ message: 'El campo apellido debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo apellido no debe ser mayor a 50 caracteres' })
  apellido: string;

  @ApiProperty({
    example: '71234567',
  })
  @IsNotEmpty({ message: 'El campo telefono no debe ser vacío' })
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(30, { message: 'El campo telefono no debe ser mayor a 30 caracteres' })
  telefono: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
  })
  @IsNotEmpty({ message: 'El campo direccion no debe ser vacío' })
  @IsString({ message: 'El campo direccion debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo direccion no debe ser mayor a 100 caracteres' })
  direccion: string;

  @ApiProperty({
    example: 'Vendedor',
  })
  @IsNotEmpty({ message: 'El campo cargo no debe ser vacío' })
  @IsString({ message: 'El campo cargo debe ser de tipo cadena' })
  @MaxLength(30, { message: 'El campo cargo no debe ser mayor a 30 caracteres' })
  cargo: string;
}

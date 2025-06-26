import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    example: 'Juan',
  })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo nombre no debe ser mayor a 50 caracteres' })
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
  })
  @IsOptional()
  @IsString({ message: 'El campo apellido debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo apellido no debe ser mayor a 50 caracteres' })
  apellido?: string;

  @ApiProperty({
    example: '+591 71234567',
  })
  @IsOptional()
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo telefono no debe ser mayor a 50 caracteres' })
  @Matches(/^[0-9+\-\s()]+$/, { message: 'El campo telefono tiene un formato inválido' })
  telefono?: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
  })
  @IsOptional()
  @IsString({ message: 'El campo direccion debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo direccion no debe ser mayor a 50 caracteres' })
  direccion?: string;
}

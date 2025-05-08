import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';

export class CreateContactoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsEmail({}, { message: 'El campo email debe ser un correo válido' })
  @MaxLength(70, { message: 'El campo email no debe ser mayor a 70 caracteres' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo telefono es obligatorio' })
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo telefono no debe ser mayor a 20 caracteres' })
  readonly telefono: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo mensaje es obligatorio' })
  @IsString({ message: 'El campo mensaje debe ser de tipo cadena' })
  @MaxLength(500, { message: 'El campo mensaje no debe ser mayor a 500 caracteres' })
  readonly mensaje: string;
}
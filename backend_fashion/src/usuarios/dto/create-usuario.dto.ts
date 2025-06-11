import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, {
    message: 'El campo nombre no debe ser mayor a 50 caracteres',
  })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsString({ message: 'El campo email debe ser de tipo cadena' })
  @MaxLength(70, {
    message: 'El campo email no debe ser mayor a 70 caracteres',
  })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  @IsString({ message: 'El campo password debe ser de tipo cadena' })
  @MaxLength(128, {
    message: 'El campo password no debe ser mayor a 128 caracteres',
  })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo rol es obligatorio' })
  @IsEnum(['admin', 'usuario'], { message: 'El rol debe ser admin o usuario' })
  readonly rol: string;
  usuario: any;
  premium: any;
  clave: string;
}

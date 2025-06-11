import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  @IsString({ message: 'El campo usuario debe ser de tipo cadena' })
  @MaxLength(15, {
    message: 'El campo usuario no debe ser mayor a 15 caracteres',
  })
  readonly nombreUsuario: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo premium debe estar definido' })
  @IsBooleanString({ message: 'El campo premium debe ser de tipo verdadero' })
  readonly premium: boolean;
  usuario: any;
  clave: any;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo total veta no de ser vacío' })
  @IsNumber(
    {},
    { message: 'El campo precio unitario debe ser de tipo numérico' },
  )
  readonly totalVenta: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo idVEnta debe estar definido' })
  @IsNumber({}, { message: 'El campo idVEnta debe ser de tipo numérico' })
  readonly idCliente: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo idEmpleado debe estar definido' })
  @IsNumber({}, { message: 'El campo idEmpleado debe ser de tipo numérico' })
  readonly idEmpleado: number;
}

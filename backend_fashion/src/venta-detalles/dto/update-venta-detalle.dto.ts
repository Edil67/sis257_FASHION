import { PartialType } from '@nestjs/swagger';
import { CreateVentaDetalleDto } from './create-venta-detalle.dto';

export class UpdateVentaDetalleDto extends PartialType(CreateVentaDetalleDto) {}

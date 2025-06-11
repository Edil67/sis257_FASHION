import { Injectable } from '@nestjs/common';
import { CreateVentaDetalleDto } from './dto/create-venta-detalle.dto';
import { UpdateVentaDetalleDto } from './dto/update-venta-detalle.dto';

@Injectable()
export class VentaDetallesService {
  create(createVentaDetalleDto: CreateVentaDetalleDto) {
    return 'This action adds a new ventaDetalle';
  }

  findAll() {
    return `This action returns all ventaDetalles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ventaDetalle`;
  }

  update(id: number, updateVentaDetalleDto: UpdateVentaDetalleDto) {
    return `This action updates a #${id} ventaDetalle`;
  }

  remove(id: number) {
    return `This action removes a #${id} ventaDetalle`;
  }
}

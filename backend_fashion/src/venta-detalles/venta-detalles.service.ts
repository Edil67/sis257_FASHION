import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDetalleDto } from './dto/create-venta-detalle.dto';
import { UpdateVentaDetalleDto } from './dto/update-venta-detalle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Repository } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';

@Injectable()
export class VentaDetallesService {
  constructor(
    @InjectRepository(VentaDetalle)
    private VentaDetalleRepository: Repository<VentaDetalle>,
  ) {}

  async create(
    createVentadetalleDto: CreateVentaDetalleDto,
  ): Promise<VentaDetalle> {
    const ventadetalle = this.VentaDetalleRepository.create({
      cantidad: createVentadetalleDto.cantidad,
      subtotal: createVentadetalleDto.subtotal,
      venta: { id: createVentadetalleDto.idVenta },
      producto: { id: createVentadetalleDto.idProducto },
    });
    return this.VentaDetalleRepository.save(ventadetalle);
  }

  async findAll(): Promise<VentaDetalle[]> {
    return this.VentaDetalleRepository.find({
      relations: ['venta', 'producto'],
    });
  }

  async findOne(id: number): Promise<VentaDetalle> {
    const ventadetalle = await this.VentaDetalleRepository.findOne({
      where: { id },
      relations: ['venta', 'producto'],
    });
    if (!ventadetalle) {
      throw new NotFoundException(`El venta detalle con el id ${id} no existe`);
    }
    return ventadetalle;
  }
  async update(
    id: number,
    updateVentadetalleDto: UpdateVentaDetalleDto,
  ): Promise<VentaDetalle> {
    const ventadetalle = await this.findOne(id);
    if (!ventadetalle) {
      throw new NotFoundException(
        `La venta de  detalle con el id ${id} no existe`,
      );
    }
    const actuvd = Object.assign(ventadetalle, updateVentadetalleDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    actuvd.venta = { id: updateVentadetalleDto.idVenta } as Venta;
    actuvd.producto = { id: updateVentadetalleDto.idProducto } as Producto;
    return this.VentaDetalleRepository.save(actuvd);
  }

  async remove(id: number) {
    const ventadetalle = await this.findOne(id);
    if (!ventadetalle) {
      throw new NotFoundException(
        `La venta de  detalle con el id ${id} no existe`,
      );
    }
    return this.VentaDetalleRepository.delete(ventadetalle.id);
  }
}

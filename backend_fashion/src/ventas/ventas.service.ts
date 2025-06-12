import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { VentaDetalle } from 'src/venta-detalles/entities/venta-detalle.entity';
import { InjectRepository as InjectDetalleRepository } from '@nestjs/typeorm';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventasRepository: Repository<Venta>,
    @InjectDetalleRepository(VentaDetalle)
    private detallesRepository: Repository<VentaDetalle>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    // Crea la venta principal
    const venta = this.ventasRepository.create({
      totalVenta: createVentaDto.totalVenta,
      cliente: { id: createVentaDto.idCliente } as Cliente,
      empleado: { id: createVentaDto.idEmpleado } as Empleado,
      fechaCreacion: new Date(),
    });
    const ventaGuardada = await this.ventasRepository.save(venta);
    return ventaGuardada; // <-- Retorna la venta guardada
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: ['cliente', 'empleado'],
    });
  }

  async findOne(id: number): Promise<Venta> {
    const existeventa = await this.ventasRepository.findOne({
      where: { id },
      relations: [
        'cliente',
        'empleado',
        'ventadetalles',
        'ventadetalles.producto',
      ],
    });
    if (!existeventa) {
      throw new NotFoundException(`No existe venta con id ${id}`);
    }
    return existeventa;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.ventasRepository.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException(`No existe venta con id ${id}`);
    }
    if (updateVentaDto.totalVenta !== undefined) {
      venta.totalVenta = updateVentaDto.totalVenta;
    }
    if (updateVentaDto.idCliente !== undefined) {
      venta.cliente = { id: updateVentaDto.idCliente } as Cliente;
    }
    if (updateVentaDto.idEmpleado !== undefined) {
      venta.empleado = { id: updateVentaDto.idEmpleado } as Empleado;
    }
    return this.ventasRepository.save(venta);
  }

  async remove(id: number) {
    const venta = await this.ventasRepository.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException(`No existe venta con id ${id}`);
    }
    return this.ventasRepository.delete(id);
  }
}

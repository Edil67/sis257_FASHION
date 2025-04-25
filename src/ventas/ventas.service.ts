import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    const producto = await this.productoRepository.findOne({
      where: { id: createVentaDto.producto_id },
    });
    const cliente = await this.clienteRepository.findOne({
      where: { id: createVentaDto.cliente_id },
    });

    if (!producto || !cliente) {
      throw new Error('Producto o Cliente no encontrado');
    }

    const venta = this.ventaRepository.create({
      ...createVentaDto,
      producto,
      cliente,
      total: producto.precio * createVentaDto.cantidad,
    });

    return this.ventaRepository.save(venta);
  }

  findAll() {
    return this.ventaRepository.find({
      relations: ['producto', 'cliente'],
    });
  }

  findOne(id: number) {
    return this.ventaRepository.findOne({
      where: { id },
      relations: ['producto', 'cliente'],
    });
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.findOne(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    if (updateVentaDto.producto_id) {
      const producto = await this.productoRepository.findOne({
        where: { id: updateVentaDto.producto_id },
      });
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      venta.producto = producto;
    }

    if (updateVentaDto.cliente_id) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: updateVentaDto.cliente_id },
      });
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }
      venta.cliente = cliente;
    }

    if (updateVentaDto.cantidad) {
      venta.cantidad = updateVentaDto.cantidad;
      venta.total = venta.producto.precio * updateVentaDto.cantidad;
    }

    return this.ventaRepository.save(venta);
  }

  remove(id: number) {
    return this.ventaRepository.delete(id);
  }
}

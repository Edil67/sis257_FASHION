import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private dataSource: DataSource,
  ) {}

  async obtenerVentas(): Promise<Venta[]> {
    console.log('Obteniendo todas las ventas...');
    const ventas = await this.ventaRepository.find({
      relations: ['cliente', 'ventadetalles', 'ventadetalles.producto'],
    });
    console.log('Ventas obtenidas:', ventas);
    return ventas;
  }

  async obtenerVentaPorId(id: number): Promise<Venta> {
    console.log(`Buscando venta por ID: ${id}`);
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'ventadetalles', 'ventadetalles.producto'],
    });

    if (!venta) {
      console.log(`No se encontró la venta con ID: ${id}`);
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    console.log('Venta encontrada:', venta);
    return venta;
  }

  async obtenerVentaDetalles(id: number): Promise<DetalleVenta[]> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['ventadetalles', 'ventadetalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    if (!venta.ventadetalles || venta.ventadetalles.length === 0) {
      throw new NotFoundException(
        `No se encontraron detalles para la venta con ID ${id}`,
      );
    }

    return venta.ventadetalles;
  }

  async crearVenta(createVentaDto: CreateVentaDto): Promise<Venta> {
    console.log('Iniciando creación de venta con DTO:', createVentaDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let cliente: Cliente | null = null;
      if (createVentaDto.idCliente) {
        console.log(`Buscando cliente con ID: ${createVentaDto.idCliente}`);
        cliente = await this.clienteRepository.findOne({
          where: { id: createVentaDto.idCliente },
        });
        if (!cliente) {
          console.log(
            `Cliente con ID ${createVentaDto.idCliente} no encontrado`,
          );
          throw new NotFoundException(
            `Cliente con ID ${createVentaDto.idCliente} no encontrado`,
          );
        }
        console.log('Cliente encontrado:', cliente);
      }

      const nuevaVenta = this.ventaRepository.create({
        metodoPago: createVentaDto.metodoPago || 'efectivo',
        totalVenta: 0,
        estado: 'pendiente',
        montoPagado: null, // Puede ser null
        cambio: null, // Puede ser null
      });

      if (cliente) {
        nuevaVenta.cliente = cliente;
      }

      console.log('Guardando nueva venta (sin detalles aún)...', nuevaVenta);
      const ventaGuardada = await queryRunner.manager.save(nuevaVenta);
      console.log('Venta guardada:', ventaGuardada);

      let totalVenta = 0;

      if (!createVentaDto.detalles || !createVentaDto.detalles.length) {
        console.log('No se proporcionaron detalles de venta');
        throw new BadRequestException(
          'La venta debe contener al menos un detalle',
        );
      }

      for (const detalle of createVentaDto.detalles) {
        console.log('Procesando detalle:', detalle);
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.idProducto },
        });

        if (!producto) {
          console.log(`Producto con ID ${detalle.idProducto} no encontrado`);
          throw new NotFoundException(
            `Producto con ID ${detalle.idProducto} no encontrado`,
          );
        }
        console.log('Producto encontrado:', producto);

        const cantidadNum = Number(detalle.cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
          console.log(
            `Cantidad inválida para el producto ${producto.nombre}:`,
            detalle.cantidad,
          );
          throw new BadRequestException(
            `La cantidad para el producto ${producto.nombre} debe ser un número positivo`,
          );
        }

        if (producto.stock < cantidadNum) {
          console.log(
            `Stock insuficiente para el producto ${producto.nombre}. Stock actual: ${producto.stock}, solicitado: ${cantidadNum}`,
          );
          throw new BadRequestException(
            `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${cantidadNum}`,
          );
        }

        const precio = Number(producto.precio);
        const subtotal = precio * cantidadNum;

        console.log(
          `Creando detalle de venta para producto ${producto.nombre}: cantidad=${cantidadNum}, precio=${precio}, subtotal=${subtotal}`,
        );
        const nuevoDetalle = this.detalleVentaRepository.create({
          cantidad: cantidadNum,
          precioUnitario: precio,
          subtotal: subtotal,
          venta: { id: ventaGuardada.id },
          producto: { id: producto.id },
        });

        await queryRunner.manager.save(nuevoDetalle);
        console.log('Detalle de venta guardado:', nuevoDetalle);

        producto.stock -= cantidadNum;
        await queryRunner.manager.save(producto);
        console.log(
          `Stock actualizado para producto ${producto.nombre}: nuevo stock=${producto.stock}`,
        );

        totalVenta += subtotal;
        console.log(
          `Subtotal sumado al totalVenta. Total actual: ${totalVenta}`,
        );
      }

      // Calcular cambio solo si montoPagado está definido
      if (
        createVentaDto.montoPagado !== undefined &&
        createVentaDto.montoPagado !== null
      ) {
        const montoPagado = Number(createVentaDto.montoPagado);
        if (montoPagado < totalVenta) {
          throw new BadRequestException(
            `El monto pagado (${montoPagado}) es menor al total de la venta (${totalVenta})`,
          );
        }
        const cambio = Number((montoPagado - totalVenta).toFixed(2));

        ventaGuardada.montoPagado = montoPagado;
        ventaGuardada.cambio = cambio;
        console.log('Monto pagado y cambio calculados:', {
          montoPagado,
          cambio,
        });
      }

      ventaGuardada.totalVenta = totalVenta;
      await queryRunner.manager.save(ventaGuardada);
      console.log('Total de la venta actualizado:', totalVenta);

      await queryRunner.commitTransaction();
      console.log('Transacción confirmada. Venta creada exitosamente.');

      return this.obtenerVentaPorId(ventaGuardada.id);
    } catch (error) {
      console.log('Ocurrió un error durante la creación de la venta:', error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al procesar la venta: ' + error.message,
      );
    } finally {
      await queryRunner.release();
      console.log('QueryRunner liberado.');
    }
  }

  async anularVenta(id: number): Promise<Venta> {
    console.log(`Iniciando anulación de venta con ID: ${id}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await this.ventaRepository.findOne({
        where: { id },
        relations: ['ventadetalles', 'ventadetalles.producto'],
      });

      if (!venta) {
        console.log(`Venta con ID ${id} no encontrada para anular`);
        throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
      }

      if (venta.estado === 'anulada') {
        console.log(`La venta con ID ${id} ya está anulada`);
        throw new BadRequestException(`La venta con ID ${id} ya está anulada`);
      }

      const fechaAnulacion = new Date();

      console.log('Restaurando stock de productos de la venta...');
      for (const detalle of venta.ventadetalles) {
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.producto.id },
        });

        if (producto) {
          const cantidadNum = Number(detalle.cantidad);
          if (!isNaN(cantidadNum)) {
            producto.stock += cantidadNum;
            await queryRunner.manager.save(producto);
            console.log(
              `Stock restaurado para producto ${producto.nombre}: nuevo stock=${producto.stock}`,
            );
          } else {
            console.log(
              `Cantidad inválida en detalle de venta para producto ID ${producto.id}`,
            );
          }
        } else {
          console.log(
            `Producto con ID ${detalle.producto.id} no encontrado al restaurar stock`,
          );
        }

        // Actualizar fechaAnulacion en el detalle
        detalle.fechaAnulacion = fechaAnulacion;
        await queryRunner.manager.save(detalle);
      }

      venta.estado = 'anulada';
      venta.totalVenta = 0;
      venta.fechaAnulacion = fechaAnulacion;
      await queryRunner.manager.save(venta);
      console.log(
        'Venta marcada como anulada, totalVenta puesto en 0 y fechaAnulacion actualizada',
      );

      await queryRunner.commitTransaction();
      console.log('Transacción de anulación confirmada.');

      return venta;
    } catch (error) {
      console.log('Ocurrió un error durante la anulación de la venta:', error);
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al anular la venta: ' + error.message,
      );
    } finally {
      await queryRunner.release();
      console.log('QueryRunner liberado tras anulación.');
    }
  }

  async limpiarVentasAnuladas(): Promise<{
    cantidadRegistrosEliminados: number;
    mensaje?: string;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar ventas anuladas
      const ventasAnuladas = await this.ventaRepository.find({
        where: { estado: 'anulada' },
        relations: ['ventadetalles'],
      });

      if (ventasAnuladas.length === 0) {
        return {
          cantidadRegistrosEliminados: 0,
          mensaje: 'No se encontraron ventas anuladas para eliminar.',
        };
      }

      // Soft-remove detalles de cada venta anulada
      let detallesEliminados = 0;
      for (const venta of ventasAnuladas) {
        if (venta.ventadetalles && venta.ventadetalles.length > 0) {
          for (const detalle of venta.ventadetalles) {
            await queryRunner.manager.softRemove(DetalleVenta, detalle);
            detallesEliminados++;
          }
        }
        // Soft-remove la venta anulada
        await queryRunner.manager.softRemove(Venta, venta);
      }

      await queryRunner.commitTransaction();

      return {
        cantidadRegistrosEliminados: ventasAnuladas.length,
        mensaje: `Ventas anuladas eliminadas (soft): ${ventasAnuladas.length}, detalles eliminados (soft): ${detallesEliminados}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al limpiar ventas anuladas: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async softRemoveVenta(id: number): Promise<{ mensaje: string }> {
    console.log(`Iniciando eliminación suave de venta con ID: ${id}`);

    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['ventadetalles'],
    });

    if (!venta) {
      console.log(`Venta con ID ${id} no encontrada para eliminación suave`);
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Soft-remove detalles de la venta
      if (venta.ventadetalles && venta.ventadetalles.length > 0) {
        for (const detalle of venta.ventadetalles) {
          await queryRunner.manager.softRemove(DetalleVenta, detalle);
        }
      }

      // Soft-remove la venta
      await queryRunner.manager.softRemove(Venta, venta);

      await queryRunner.commitTransaction();
      console.log(`Venta con ID ${id} eliminada exitosamente (soft)`);

      return { mensaje: `Venta con ID ${id} eliminada exitosamente` };
    } catch (error) {
      console.log('Error durante la eliminación suave de la venta:', error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al eliminar la venta: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateVenta(id: number, updateVentaDto: any): Promise<Venta> {
    console.log(`Actualizando venta con ID: ${id}`, updateVentaDto);

    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'ventadetalles', 'ventadetalles.producto'],
    });

    if (!venta) {
      console.log(`Venta con ID ${id} no encontrada para actualizar`);
      throw new NotFoundException(`La venta con ID ${id} no fue encontrada`);
    }

    // Solo permitir actualizar el estado
    if (updateVentaDto.estado) {
      venta.estado = updateVentaDto.estado;
    }

    const ventaActualizada = await this.ventaRepository.save(venta);
    console.log(`Venta con ID ${id} actualizada exitosamente`);

    return this.obtenerVentaPorId(ventaActualizada.id);
  }
}

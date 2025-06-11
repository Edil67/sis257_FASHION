import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Venta } from './entities/venta.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Empleado])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}

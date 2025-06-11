import { Module } from '@nestjs/common';
import { VentaDetallesService } from './venta-detalles.service';
import { VentaDetallesController } from './venta-detalles.controller';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VentaDetalle])],
  controllers: [VentaDetallesController],
  providers: [VentaDetallesService],
})
export class VentaDetallesModule {}

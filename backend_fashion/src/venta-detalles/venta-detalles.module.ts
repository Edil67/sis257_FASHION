import { Module } from '@nestjs/common';
import { VentaDetallesService } from './venta-detalles.service';
import { VentaDetallesController } from './venta-detalles.controller';

@Module({
  controllers: [VentaDetallesController],
  providers: [VentaDetallesService],
})
export class VentaDetallesModule {}

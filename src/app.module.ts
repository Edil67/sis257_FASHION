import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ClientesModule } from './clientes/clientes.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [ProductosModule, ClientesModule, VentasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

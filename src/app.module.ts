import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ClientesModule } from './clientes/clientes.module';
import { VentasModule } from './ventas/ventas.module';
import { Producto } from './productos/entities/producto.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Venta } from './ventas/entities/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'fashion_db',
      entities: [Producto, Cliente, Venta],
      synchronize: true, // Solo para desarrollo, en producción debe ser false
    }),
    ProductosModule,
    ClientesModule,
    VentasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

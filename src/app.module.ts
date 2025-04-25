import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { Cliente } from './clientes/entities/cliente.entity';
import { Producto } from './productos/entities/producto.entity';
import { Venta } from './ventas/entities/venta.entity';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'fashion_db',
      entities: [Cliente, Producto, Venta],
      synchronize: true, // Solo para desarrollo, en producción debe ser false
    }),
    ClientesModule,
    ProductosModule,
    VentasModule,
    CategoriasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

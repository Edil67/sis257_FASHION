import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { ProductosModule } from './productos/productos.module';
import { ClientesModule } from './clientes/clientes.module';
import { VentasModule } from './ventas/ventas.module';
import { Producto } from './productos/entities/producto.entity';
import { Cliente } from './clientes/entities/cliente.entity';
=======
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { Cliente } from './clientes/entities/cliente.entity';
import { Producto } from './productos/entities/producto.entity';
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc
import { Venta } from './ventas/entities/venta.entity';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
<<<<<<< HEAD
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
=======
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
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc
    VentasModule,
CategoriasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
<<<<<<< HEAD
export class AppModule {}
=======
export class AppModule {} 
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc

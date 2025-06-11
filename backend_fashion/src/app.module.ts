import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { VentaDetallesModule } from './venta-detalles/venta-detalles.module';
import { VentasDetallesModule } from './ventas-detalles/ventas-detalles.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { VentasModule } from './ventas/ventas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { ContactosModule } from './contactos/contactos.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '*/**/entities/*.{ts|js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsuariosModule,
    CategoriasModule,
    ProductosModule,
    ContactosModule,
    ClientesModule,
    VentasModule,
    EmpleadosModule,
    VentasDetallesModule,
    VentaDetallesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

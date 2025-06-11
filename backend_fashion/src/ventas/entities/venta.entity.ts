import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { VentaDetalle } from 'src/venta-detalles/entities/venta-detalle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column({ name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ name: 'total_venta' })
  totalVenta: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  // Muchas ventas puede realizar a un cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'idCliente', referencedColumnName: 'id' })
  cliente: Cliente;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'idProducto', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Empleado, (empleado) => empleado.ventas)
  @JoinColumn({ name: 'idEmpleado', referencedColumnName: 'id' })
  empleado: Empleado;

  // Una venta puede tener varios detalles de venta
  @OneToMany(() => VentaDetalle, (ventadetalle) => ventadetalle.venta)
  ventadetalles: VentaDetalle[];
}

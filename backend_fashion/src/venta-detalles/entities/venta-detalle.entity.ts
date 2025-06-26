import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ventadetalles')
export class VentaDetalle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('int', { nullable: false })
  precioUnitario: number;
  @Column('int', { nullable: false })
  cantidad: number;
  @Column('int', { nullable: false })
  subtotal: number;
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.ventadetalles)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.ventadetalles)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
  static precioUnitario: number | undefined;
}

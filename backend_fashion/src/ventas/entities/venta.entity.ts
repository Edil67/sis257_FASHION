import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { 
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({name: 'fecha_creacion'})
  fechaCreacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id'})
  cliente: Cliente;

  @ManyToOne(() => Producto, (producto) => producto.ventas)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id'})
  producto: Producto;
}
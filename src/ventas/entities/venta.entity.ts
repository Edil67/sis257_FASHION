import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column({ type: 'date' })
  fechaVenta: Date;

  @Column({ type: 'date' })
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Producto)
  producto: Producto;

  @ManyToOne(() => Cliente)
  cliente: Cliente;
} 
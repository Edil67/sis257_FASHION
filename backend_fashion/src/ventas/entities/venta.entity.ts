import { Cliente } from '../../clientes/entities/cliente.entity';
import { DetalleVenta } from './detalle_venta.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_venta', type: 'numeric', precision: 10, scale: 2 })
  totalVenta: number;

  @Column({
    name: 'metodo_pago',
    type: 'varchar',
    length: 50,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'qr', 'cotización', 'otro'],
  })
  metodoPago: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'realizada',
    comment: 'Estado de la venta: realizada o anulada',
  })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @Column({ name: 'fecha_anulacion', type: 'timestamp', nullable: true })
  fechaAnulacion: Date | null;

  @Column({
    name: 'monto_pagado',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  montoPagado: number | null;

  @Column({
    name: 'cambio',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  cambio: number | null;

  //  muchas ventas puede realizar  un cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.venta)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta, {
    cascade: true,
  })
  ventadetalles: DetalleVenta[];
}

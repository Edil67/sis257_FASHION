import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, nullable: false })
  nombres: string;

  @Column('varchar', { length: 50, nullable: false })
  apellidos: string;

  @Column('varchar', { length: 50, nullable: false })
  direccion: string;

  @Column('varchar', { length: 50, nullable: false })
  telefono: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  // un cliente puede realizar muchas ventas
  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}

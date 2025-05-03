import { Venta } from 'src/ventas/entities/venta.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  


@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', {length:30})
  nombre: string;

  @Column('varchar',{length:30})
  email: string;

  @Column('varchar',{length:30})
  telefono: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id'})
  ventas: Venta[];
}
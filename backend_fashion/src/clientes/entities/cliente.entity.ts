import { Venta } from 'src/ventas/entities/venta.entity'; // <-- Agrega esta línea
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

  @Column('varchar', { length: 150, nullable: false }) // Mejor longitud para dirección
  direccion: string;

  @Column('varchar', { length: 20, nullable: false }) // Mejor longitud para teléfono
  telefono: string;

  @Column('varchar', { length: 50, nullable: false, unique: true }) // Tipo explícito
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}

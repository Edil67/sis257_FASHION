import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Column,
} from 'typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { length: 50, nullable: false })
  nombres: string;

  @Column('varchar', { length: 50, nullable: false })
  apellidos: string;

  @Column('varchar', { length: 30, nullable: false })
  cargo: string;

  @OneToMany(() => Venta, (venta) => venta.empleado)
  ventas: Venta[];

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  usuario: Usuario;
}

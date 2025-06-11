import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Venta, (venta) => venta.empleado)
  ventas: Venta[];

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  usuario: Usuario;
}

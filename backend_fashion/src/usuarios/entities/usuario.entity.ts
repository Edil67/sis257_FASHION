import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 30 })
  nombre: string;

  @Column('varchar', { length: 70 })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  usuario: string;

  @Column({ type: 'varchar' })
  clave: string;

  @Column({ type: 'boolean', default: false })
  premium: boolean;

  @Column({ type: 'enum', enum: ['admin', 'usuario'] })
  rol: string;
}

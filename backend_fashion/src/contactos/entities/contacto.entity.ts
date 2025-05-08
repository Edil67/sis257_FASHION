import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contactos')
export class Contacto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column()
  mensaje: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
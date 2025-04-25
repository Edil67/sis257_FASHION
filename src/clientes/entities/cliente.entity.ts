<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
=======
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
<<<<<<< HEAD
  telefono: string;

  @Column({ default: true })
  activo: boolean;
}
=======
  celular: string;

  @Column()
  direccion: string;
} 
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc

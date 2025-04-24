<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
=======
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
<<<<<<< HEAD
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  stock: number;

  @Column({ default: true })
  activo: boolean;
}
=======
  categoria: string;

  @Column()
  descripcion: string;

  @Column()
  talla: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;
} 
>>>>>>> fa99282141b4c6a12d72a9c3727eeb10c0942cbc

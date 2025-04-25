import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @Column()
  descripcion: string;

  @Column()
  talla: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;
}

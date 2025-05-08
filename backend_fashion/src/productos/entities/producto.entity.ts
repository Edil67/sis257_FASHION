import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  stock: number;

  @Column('simple-array')
  tallasDisponibles: string[];

  @Column('simple-array')
  coloresDisponibles: string[];

  @Column('simple-array')
  imagenes: string[];

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  categoria: Categoria;

  @Column()
  categoriaId: number;

  @Column()
  tipo: string;

  @Column({ default: true })
  activo: boolean;
}
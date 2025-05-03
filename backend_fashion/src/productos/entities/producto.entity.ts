import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar',{length: 30})
  nombre: string;

  @Column('varchar', {length: 40})
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2})
  precio: number;

  @Column('integer')
  stock: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id'})
  categoria: Categoria;

  @OneToMany(() => Venta, (venta) => venta.producto)
  ventas: Venta[];
}
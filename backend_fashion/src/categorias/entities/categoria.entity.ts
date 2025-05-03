import { Producto } from 'src/productos/entities/producto.entity';
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


@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 40})
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
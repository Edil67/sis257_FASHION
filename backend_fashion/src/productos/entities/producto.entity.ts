import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { VentaDetalle } from 'src/venta-detalles/entities/venta-detalle.entity';

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

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'idCategoria', referencedColumnName: 'id' })
  categoria: Categoria;

  @OneToMany(() => VentaDetalle, (ventadetalle) => ventadetalle.producto)
  ventadetalles: VentaDetalle[];
  ventas: any;
}

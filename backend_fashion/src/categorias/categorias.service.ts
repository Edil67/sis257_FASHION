import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const existe = await this.categoriasRepository.findOneBy({
      nombre: createCategoriaDto.nombre.trim(),
    });
    if (existe) throw new ConflictException('La categoría ya existe');

    const categoria = new Categoria();
    categoria.nombre = createCategoriaDto.nombre.trim();
    return this.categoriasRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOneBy({ id });
    if (!categoria) throw new NotFoundException('La categoría no existe');
    return categoria;
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    const categoria = await this.findOne(id);
    const categoriaUpdate = Object.assign(categoria, updateCategoriaDto);
    return this.categoriasRepository.save(categoriaUpdate);
  }

  async remove(id: number) {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!categoria) {
      throw new NotFoundException('La categoría no existe');
    }
    if (categoria.productos && categoria.productos.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la categoría porque tiene productos asociados',
      );
    }
    return this.categoriasRepository.remove(categoria);
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {
  constructor(@InjectRepository(Empleado) private empleadosRepository: Repository<Empleado>) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const existe = await this.empleadosRepository.findOneBy({
      nombre: createEmpleadoDto.nombre.trim(),
      apellido: createEmpleadoDto.apellido.trim(),
    });

    if (existe) throw new ConflictException('El empleado ya existe');

    const empleado = new Empleado();
    empleado.nombre = createEmpleadoDto.nombre.trim();
    empleado.apellido = createEmpleadoDto.apellido.trim();
    empleado.telefono = createEmpleadoDto.telefono.trim();
    empleado.direccion = createEmpleadoDto.direccion.trim();
    empleado.cargo = createEmpleadoDto.cargo.trim();
    return this.empleadosRepository.save(empleado);
  }

  async findAll() {
    return this.empleadosRepository.find();
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOneBy({ id });
    if (!empleado) throw new NotFoundException('El empleado no existe');
    return empleado;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.findOne(id);
    const empleadoUpdate = Object.assign(empleado, updateEmpleadoDto);
    return this.empleadosRepository.save(empleadoUpdate);
  }

  async remove(id: number) {
    const empleado = await this.findOne(id);
    if (empleado) return this.empleadosRepository.softRemove(empleado);
  }
}

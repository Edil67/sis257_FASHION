import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private contactosRepository: Repository<Contacto>,
  ) {}

  async create(createContactoDto: CreateContactoDto): Promise<Contacto> {
    const contacto = new Contacto();
    contacto.nombre = createContactoDto.nombre.trim();
    contacto.email = createContactoDto.email.trim();
    contacto.telefono = createContactoDto.telefono.trim();
    contacto.mensaje = createContactoDto.mensaje.trim();
    contacto.fecha = new Date();
    return this.contactosRepository.save(contacto);
  }

  async findAll(): Promise<Contacto[]> {
    return this.contactosRepository.find();
  }

  async findOne(id: number): Promise<Contacto> {
    const contacto = await this.contactosRepository.findOneBy({ id });
    if (!contacto) throw new NotFoundException('El contacto no existe');
    return contacto;
  }

  async update(
    id: number,
    updateContactoDto: UpdateContactoDto,
  ): Promise<Contacto> {
    const contacto = await this.findOne(id);
    const contactoUpdate = Object.assign(contacto, updateContactoDto);
    return this.contactosRepository.save(contactoUpdate);
  }

  async remove(id: number) {
    const contacto = await this.findOne(id);
    return this.contactosRepository.softRemove(contacto);
  }
}

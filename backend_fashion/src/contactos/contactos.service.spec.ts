import { Test, TestingModule } from '@nestjs/testing';
import { ContactosService } from './contactos.service';

describe('ContactosService', () => {
  let service: ContactosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactosService],
    }).compile();

    service = module.get<ContactosService>(ContactosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

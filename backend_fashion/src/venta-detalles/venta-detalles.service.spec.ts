import { Test, TestingModule } from '@nestjs/testing';
import { VentaDetallesService } from './venta-detalles.service';

describe('VentaDetallesService', () => {
  let service: VentaDetallesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentaDetallesService],
    }).compile();

    service = module.get<VentaDetallesService>(VentaDetallesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VentaDetallesController } from './venta-detalles.controller';
import { VentaDetallesService } from './venta-detalles.service';

describe('VentaDetallesController', () => {
  let controller: VentaDetallesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentaDetallesController],
      providers: [VentaDetallesService],
    }).compile();

    controller = module.get<VentaDetallesController>(VentaDetallesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

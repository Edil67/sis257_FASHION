import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentaDetallesService } from './venta-detalles.service';
import { CreateVentaDetalleDto } from './dto/create-venta-detalle.dto';
import { UpdateVentaDetalleDto } from './dto/update-venta-detalle.dto';

@Controller('venta-detalles')
export class VentaDetallesController {
  constructor(private readonly ventaDetallesService: VentaDetallesService) {}

  @Post()
  create(@Body() createVentaDetalleDto: CreateVentaDetalleDto) {
    return this.ventaDetallesService.create(createVentaDetalleDto);
  }

  @Get()
  findAll() {
    return this.ventaDetallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventaDetallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDetalleDto: UpdateVentaDetalleDto) {
    return this.ventaDetallesService.update(+id, updateVentaDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaDetallesService.remove(+id);
  }
}

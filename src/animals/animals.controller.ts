import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnimalsService } from './animals.service';

type AnimalView = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  health: 'Excelente' | 'Buena' | 'Atención' | 'Alerta';
  battery: number;
  temp: number;
  lastUpdate: string;
  status: 'ok' | 'alert';
  locationText: string;
};

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Get()
  async list(): Promise<AnimalView[]> {
    return await this.animalsService.list();
  }

  @Post()
  async create(@Body() payload: Partial<AnimalView>): Promise<AnimalView> {
    return await this.animalsService.create(payload);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<Omit<AnimalView, 'id'>>,
  ): Promise<AnimalView> {
    return await this.animalsService.update(id, payload);
  }
}

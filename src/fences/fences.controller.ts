import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FencesService } from './fences.service';

type FenceView = {
  id: string;
  name: string;
  area: string;
  animals: number;
  status: 'active' | 'inactive';
  violations: number;
  color: string;
  coordinates: [number, number][];
};

@Controller('fences')
export class FencesController {
  constructor(private readonly fencesService: FencesService) {}

  @Get()
  async list(): Promise<FenceView[]> {
    return await this.fencesService.list();
  }

  @Post()
  async create(@Body() payload: Partial<FenceView>): Promise<FenceView> {
    return await this.fencesService.create(payload);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<Omit<FenceView, 'id'>>,
  ): Promise<FenceView> {
    return await this.fencesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean; id: string }> {
    return await this.fencesService.remove(id);
  }
}

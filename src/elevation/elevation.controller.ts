import { Body, Controller, Post } from '@nestjs/common';
import { ElevationService, ElevationLocation } from './elevation.service';

type ElevationBatchRequest = {
  locations: ElevationLocation[];
};

@Controller('elevation')
export class ElevationController {
  constructor(private readonly elevationService: ElevationService) {}

  @Post('batch')
  fetchBatch(@Body() body: ElevationBatchRequest) {
    return this.elevationService.fetchBatch(body.locations ?? []);
  }
}
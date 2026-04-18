import { Module } from '@nestjs/common';
import { ElevationController } from './elevation.controller';
import { ElevationService } from './elevation.service';

@Module({
  controllers: [ElevationController],
  providers: [ElevationService],
})
export class ElevationModule {}
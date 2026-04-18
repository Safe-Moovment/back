import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FencesController } from './fences.controller';
import { FencesService } from './fences.service';
import { Fence, FenceSchema } from './schemas/fence.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Fence.name, schema: FenceSchema }])],
  controllers: [FencesController],
  providers: [FencesService],
})
export class FencesModule {}

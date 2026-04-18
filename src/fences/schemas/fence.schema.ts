import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FenceDocument = HydratedDocument<Fence>;

@Schema({ timestamps: true, collection: 'fences' })
export class Fence {
  @Prop({ required: true, unique: true, trim: true, index: true })
  id!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  area!: string;

  @Prop({ required: true })
  animals!: number;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status!: 'active' | 'inactive';

  @Prop({ required: true })
  violations!: number;

  @Prop({ required: true, trim: true })
  color!: string;

  @Prop({ type: [[Number]], required: true })
  coordinates!: [number, number][];
}

export const FenceSchema = SchemaFactory.createForClass(Fence);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnimalDocument = HydratedDocument<Animal>;

@Schema({ timestamps: true, collection: 'animals' })
export class Animal {
  @Prop({ required: true, unique: true, trim: true, index: true })
  id!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  lat!: number;

  @Prop({ required: true })
  lng!: number;

  @Prop({ required: true, enum: ['Excelente', 'Buena', 'Atención', 'Alerta'] })
  health!: 'Excelente' | 'Buena' | 'Atención' | 'Alerta';

  @Prop({ required: true })
  battery!: number;

  @Prop({ required: true })
  temp!: number;

  @Prop({ required: true })
  lastUpdate!: Date;

  @Prop({ required: true, enum: ['ok', 'alert'] })
  status!: 'ok' | 'alert';

  @Prop({ required: true, trim: true })
  locationText!: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);

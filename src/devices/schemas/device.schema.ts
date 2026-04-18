import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true, collection: 'devices' })
export class Device {
  @Prop({ required: true, unique: true, trim: true, index: true })
  id!: string;

  @Prop({ required: true, trim: true })
  animalId!: string;

  @Prop({ required: true })
  battery!: number;

  @Prop({ required: true })
  signal!: number;

  @Prop({ required: true, enum: ['active', 'warning', 'critical'] })
  status!: 'active' | 'warning' | 'critical';

  @Prop({ required: true })
  lastPing!: Date;

  @Prop({ required: true, trim: true })
  hardwareVersion!: string;

  @Prop({ required: true })
  solarCharging!: boolean;

  @Prop({ required: true, enum: ['LoRaWAN', 'LTE', 'NB-IoT'] })
  protocol!: 'LoRaWAN' | 'LTE' | 'NB-IoT';

  @Prop({ required: true, enum: ['Store & Forward', 'Real-time'] })
  lastSyncMode!: 'Store & Forward' | 'Real-time';

  @Prop({ required: true, trim: true })
  gatewayId!: string;

  @Prop({ required: true })
  alertsCount!: number;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

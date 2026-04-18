import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PendingCodeDocument = HydratedDocument<PendingCode>;

@Schema({ timestamps: false, collection: 'pending_codes' })
export class PendingCode {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true })
  codeHash!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ required: true })
  issuedAt!: Date;

  @Prop({ type: Date, required: false, default: null })
  verifiedAt?: Date | null;

  @Prop({ type: Date, required: false, default: null })
  usedAt?: Date | null;

  @Prop({ required: true, enum: ['pending', 'verified', 'used', 'expired'], default: 'pending' })
  status!: 'pending' | 'verified' | 'used' | 'expired';

  @Prop({ required: true, enum: ['registration', 'reset'] })
  purpose!: 'registration' | 'reset';
}

export const PendingCodeSchema = SchemaFactory.createForClass(PendingCode);
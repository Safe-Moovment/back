import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal } from './schemas/animal.schema';

type AnimalHealth = 'Excelente' | 'Buena' | 'Atención' | 'Alerta';
type AnimalStatus = 'ok' | 'alert';

type AnimalView = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  health: AnimalHealth;
  battery: number;
  temp: number;
  lastUpdate: string;
  status: AnimalStatus;
  locationText: string;
};

type AnimalUpsertPayload = Partial<AnimalView>;

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name)
    private readonly animalModel: Model<Animal>,
  ) {}

  async list(): Promise<AnimalView[]> {
    const rows = await this.animalModel.find().sort({ updatedAt: -1 }).lean();
    return rows.map((row) => this.toView(row));
  }

  async create(payload: AnimalUpsertPayload): Promise<AnimalView> {
    const id = this.requireString(payload.id, 'id');

    if (await this.animalModel.exists({ id })) {
      throw new ConflictException(`Animal ${id} already exists`);
    }

    const record = this.buildAnimalRecord({ ...payload, id });
    const created = await this.animalModel.create(record);

    return this.toView(created.toObject());
  }

  async update(id: string, payload: AnimalUpsertPayload): Promise<AnimalView> {
    const current = await this.animalModel.findOne({ id }).lean();
    if (!current) {
      throw new NotFoundException(`Animal ${id} was not found`);
    }

    const updatedPayload = this.buildAnimalRecord({
      ...this.toView(current),
      ...payload,
      id,
      lastUpdate: new Date().toISOString(),
    });

    const updated = await this.animalModel
      .findOneAndUpdate({ id }, updatedPayload, { new: true })
      .lean();

    if (!updated) {
      throw new NotFoundException(`Animal ${id} was not found`);
    }

    return this.toView(updated);
  }

  private toView(row: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    health: AnimalHealth;
    battery: number;
    temp: number;
    lastUpdate: Date;
    status: AnimalStatus;
    locationText: string;
  }): AnimalView {
    return {
      id: row.id,
      name: row.name,
      lat: row.lat,
      lng: row.lng,
      health: row.health,
      battery: row.battery,
      temp: row.temp,
      lastUpdate: new Date(row.lastUpdate).toISOString(),
      status: row.status,
      locationText: row.locationText,
    };
  }

  private buildAnimalRecord(payload: AnimalUpsertPayload): Omit<Animal, 'createdAt' | 'updatedAt'> {
    return {
      id: this.requireString(payload.id, 'id'),
      name: this.requireString(payload.name, 'name'),
      lat: this.requireNumber(payload.lat, 'lat'),
      lng: this.requireNumber(payload.lng, 'lng'),
      health: this.requireHealth(payload.health, 'health'),
      battery: this.requireNumber(payload.battery, 'battery'),
      temp: this.requireNumber(payload.temp, 'temp'),
      lastUpdate: this.requireDate(payload.lastUpdate, 'lastUpdate'),
      status: this.requireStatus(payload.status, 'status'),
      locationText: this.requireString(payload.locationText, 'locationText'),
    } as Omit<Animal, 'createdAt' | 'updatedAt'>;
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(`Field ${field} is required`);
    }
    return value.trim();
  }

  private requireNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new BadRequestException(`Field ${field} must be a valid number`);
    }
    return value;
  }

  private requireDate(value: unknown, field: string): Date {
    if (typeof value !== 'string') {
      throw new BadRequestException(`Field ${field} must be a valid ISO date string`);
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Field ${field} must be a valid ISO date string`);
    }
    return parsed;
  }

  private requireHealth(value: unknown, field: string): AnimalHealth {
    if (
      value === 'Excelente' ||
      value === 'Buena' ||
      value === 'Atención' ||
      value === 'Alerta'
    ) {
      return value;
    }

    throw new BadRequestException(
      `Field ${field} must be Excelente, Buena, Atención or Alerta`,
    );
  }

  private requireStatus(value: unknown, field: string): AnimalStatus {
    if (value === 'ok' || value === 'alert') {
      return value;
    }

    throw new BadRequestException(`Field ${field} must be ok or alert`);
  }
}

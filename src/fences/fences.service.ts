import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fence } from './schemas/fence.schema';

type FenceStatus = 'active' | 'inactive';

type FenceView = {
  id: string;
  name: string;
  area: string;
  animals: number;
  status: FenceStatus;
  violations: number;
  color: string;
  coordinates: [number, number][];
};

type FenceUpsertPayload = Partial<FenceView>;

@Injectable()
export class FencesService {
  constructor(
    @InjectModel(Fence.name)
    private readonly fenceModel: Model<Fence>,
  ) {}

  async list(): Promise<FenceView[]> {
    const rows = await this.fenceModel.find().sort({ updatedAt: -1 }).lean();
    return rows.map((row) => this.toView(row));
  }

  async create(payload: FenceUpsertPayload): Promise<FenceView> {
    const id = this.requireString(payload.id, 'id');

    if (await this.fenceModel.exists({ id })) {
      throw new ConflictException(`Fence ${id} already exists`);
    }

    const created = await this.fenceModel.create(this.buildFenceRecord({ ...payload, id }));
    return this.toView(created.toObject());
  }

  async update(id: string, payload: FenceUpsertPayload): Promise<FenceView> {
    const current = await this.fenceModel.findOne({ id }).lean();
    if (!current) {
      throw new NotFoundException(`Fence ${id} was not found`);
    }

    const updated = await this.fenceModel
      .findOneAndUpdate(
        { id },
        this.buildFenceRecord({ ...this.toView(current), ...payload, id }),
        { new: true },
      )
      .lean();

    if (!updated) {
      throw new NotFoundException(`Fence ${id} was not found`);
    }

    return this.toView(updated);
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.fenceModel.deleteOne({ id });
    if (!result.deletedCount) {
      throw new NotFoundException(`Fence ${id} was not found`);
    }
    return { deleted: true, id };
  }

  private toView(row: {
    id: string;
    name: string;
    area: string;
    animals: number;
    status: FenceStatus;
    violations: number;
    color: string;
    coordinates: [number, number][];
  }): FenceView {
    return {
      id: row.id,
      name: row.name,
      area: row.area,
      animals: row.animals,
      status: row.status,
      violations: row.violations,
      color: row.color,
      coordinates: row.coordinates.map((point) => [point[0], point[1]]),
    };
  }

  private buildFenceRecord(payload: FenceUpsertPayload): Omit<Fence, 'createdAt' | 'updatedAt'> {
    return {
      id: this.requireString(payload.id, 'id'),
      name: this.requireString(payload.name, 'name'),
      area: this.requireString(payload.area, 'area'),
      animals: this.requireNumber(payload.animals, 'animals'),
      status: this.requireStatus(payload.status, 'status'),
      violations: this.requireNumber(payload.violations, 'violations'),
      color: this.requireString(payload.color, 'color'),
      coordinates: this.requireCoordinates(payload.coordinates, 'coordinates'),
    } as Omit<Fence, 'createdAt' | 'updatedAt'>;
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

  private requireStatus(value: unknown, field: string): FenceStatus {
    if (value === 'active' || value === 'inactive') {
      return value;
    }
    throw new BadRequestException(`Field ${field} must be active or inactive`);
  }

  private requireCoordinates(value: unknown, field: string): [number, number][] {
    if (!Array.isArray(value) || value.length < 3) {
      throw new BadRequestException(`Field ${field} must be an array with at least 3 points`);
    }

    return value.map((point, index) => {
      if (!Array.isArray(point) || point.length !== 2) {
        throw new BadRequestException(`Field ${field}[${index}] must be [lat, lng]`);
      }
      const lat = point[0];
      const lng = point[1];
      if (typeof lat !== 'number' || Number.isNaN(lat)) {
        throw new BadRequestException(`Field ${field}[${index}][0] must be number`);
      }
      if (typeof lng !== 'number' || Number.isNaN(lng)) {
        throw new BadRequestException(`Field ${field}[${index}][1] must be number`);
      }
      return [lat, lng] as [number, number];
    });
  }
}

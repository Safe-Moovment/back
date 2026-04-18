import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  createDeviceTelemetryData,
  DeviceTelemetryMock,
} from '../mocks/health-biometric.mock';
import { Device } from './schemas/device.schema';

type DeviceStatus = 'active' | 'warning' | 'critical';

type DeviceView = {
  id: string;
  animalId: string;
  battery: number;
  signal: number;
  status: DeviceStatus;
  lastPing: string;
  hardwareVersion: string;
  solarCharging: boolean;
  protocol: 'LoRaWAN' | 'LTE' | 'NB-IoT';
  lastSyncMode: 'Store & Forward' | 'Real-time';
  gatewayId: string;
  alertsCount: number;
};

type DeviceUpsertPayload = Partial<DeviceView>;

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
  ) {}

  async list(): Promise<DeviceView[]> {
    const rows = await this.deviceModel.find().sort({ updatedAt: -1 }).lean();
    return rows.map((row) => this.toDeviceView(row));
  }

  async create(payload: DeviceUpsertPayload): Promise<DeviceView> {
    const id = this.requireString(payload.id, 'id');

    if (await this.deviceModel.exists({ id })) {
      throw new ConflictException(`Device ${id} already exists`);
    }

    const record = this.buildRecord({ ...payload, id });
    const created = await this.deviceModel.create(record);

    return this.toDeviceView(created.toObject());
  }

  async update(id: string, payload: DeviceUpsertPayload): Promise<DeviceView> {
    const current = await this.deviceModel.findOne({ id }).lean();
    if (!current) {
      throw new NotFoundException(`Device ${id} was not found`);
    }

    const mergedPayload: DeviceUpsertPayload = {
      ...this.toDeviceView(current),
      ...payload,
      id,
      lastPing: new Date().toISOString(),
    };

    const updatedRecord = this.buildRecord(mergedPayload);

    const updated = await this.deviceModel
      .findOneAndUpdate({ id }, updatedRecord, { new: true })
      .lean();

    if (!updated) {
      throw new NotFoundException(`Device ${id} was not found`);
    }

    return this.toDeviceView(updated);
  }

  private buildRecord(payload: DeviceUpsertPayload): Omit<Device, 'createdAt' | 'updatedAt'> {
    const id = this.requireString(payload.id, 'id');
    const batteryLevel = this.requireNumber(payload.battery, 'battery');
    const signalPercent = this.requireNumber(payload.signal, 'signal');
    const status = this.requireStatus(payload.status, 'status');
    const animalId = this.requireString(payload.animalId, 'animalId');
    const hardwareVersion = this.requireString(
      payload.hardwareVersion,
      'hardwareVersion',
    );
    const solarCharging = this.requireBoolean(
      payload.solarCharging,
      'solarCharging',
    );
    const protocol = this.requireProtocol(payload.protocol, 'protocol');
    const lastSyncMode = this.requireSyncMode(
      payload.lastSyncMode,
      'lastSyncMode',
    );
    const gatewayId = this.requireString(payload.gatewayId, 'gatewayId');
    const alertsCount = this.requireNumber(payload.alertsCount, 'alertsCount');

    createDeviceTelemetryData({
      device_id: id,
      hardware_version: hardwareVersion,
      battery: {
        level: batteryLevel,
        status: this.mapStatusToBattery(status),
        solar_charging: solarCharging,
      },
      connectivity: {
        protocol,
        rssi: this.signalPercentToRssi(signalPercent),
        last_sync_mode: lastSyncMode,
        gateway_id: gatewayId,
      },
      alerts_count: alertsCount,
    });

    return {
      id,
      animalId,
      battery: batteryLevel,
      signal: signalPercent,
      status,
      lastPing: this.requireDate(payload.lastPing, 'lastPing'),
      hardwareVersion,
      solarCharging,
      protocol,
      lastSyncMode,
      gatewayId,
      alertsCount,
    } as Omit<Device, 'createdAt' | 'updatedAt'>;
  }

  private toDeviceView(row: {
    id: string;
    animalId: string;
    battery: number;
    signal: number;
    status: DeviceStatus;
    lastPing: Date;
    hardwareVersion: string;
    solarCharging: boolean;
    protocol: 'LoRaWAN' | 'LTE' | 'NB-IoT';
    lastSyncMode: 'Store & Forward' | 'Real-time';
    gatewayId: string;
    alertsCount: number;
  }): DeviceView {
    return {
      id: row.id,
      animalId: row.animalId,
      battery: row.battery,
      signal: row.signal,
      status: row.status,
      lastPing: new Date(row.lastPing).toISOString(),
      hardwareVersion: row.hardwareVersion,
      solarCharging: row.solarCharging,
      protocol: row.protocol,
      lastSyncMode: row.lastSyncMode,
      gatewayId: row.gatewayId,
      alertsCount: row.alertsCount,
    };
  }

  private signalPercentToRssi(signalPercent: number): number {
    const normalized = Math.max(0, Math.min(100, signalPercent));
    return Math.round(-120 + normalized * 0.7);
  }

  private mapStatusToBattery(
    status: DeviceStatus,
  ): DeviceTelemetryMock['battery']['status'] {
    if (status === 'critical') {
      return 'critical';
    }
    if (status === 'warning') {
      return 'low';
    }
    return 'normal';
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

  private requireStatus(value: unknown, field: string): DeviceStatus {
    if (value === 'active' || value === 'warning' || value === 'critical') {
      return value;
    }
    throw new BadRequestException(
      `Field ${field} must be active, warning or critical`,
    );
  }

  private requireBoolean(value: unknown, field: string): boolean {
    if (typeof value !== 'boolean') {
      throw new BadRequestException(`Field ${field} must be boolean`);
    }
    return value;
  }

  private requireProtocol(
    value: unknown,
    field: string,
  ): DeviceTelemetryMock['connectivity']['protocol'] {
    if (value === 'LoRaWAN' || value === 'LTE' || value === 'NB-IoT') {
      return value;
    }
    throw new BadRequestException(
      `Field ${field} must be LoRaWAN, LTE or NB-IoT`,
    );
  }

  private requireSyncMode(
    value: unknown,
    field: string,
  ): DeviceTelemetryMock['connectivity']['last_sync_mode'] {
    if (value === 'Store & Forward' || value === 'Real-time') {
      return value;
    }
    throw new BadRequestException(
      `Field ${field} must be Store & Forward or Real-time`,
    );
  }
}

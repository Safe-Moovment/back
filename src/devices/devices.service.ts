import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  createDeviceTelemetryData,
  DeviceTelemetryMock,
} from '../mocks/health-biometric.mock';

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

type DeviceRecord = {
  animalId: string;
  telemetry: DeviceTelemetryMock;
  lastPing: string;
};

type DeviceUpsertPayload = Partial<DeviceView>;

@Injectable()
export class DevicesService {
  private readonly devices = new Map<string, DeviceRecord>();

  list(): DeviceView[] {
    return Array.from(this.devices.values()).map((record) =>
      this.toDeviceView(record),
    );
  }

  create(payload: DeviceUpsertPayload): DeviceView {
    const id = this.requireString(payload.id, 'id');

    if (this.devices.has(id)) {
      throw new BadRequestException(`Device ${id} already exists`);
    }

    const record = this.buildRecord(payload);
    this.devices.set(id, record);

    return this.toDeviceView(record);
  }

  update(id: string, payload: DeviceUpsertPayload): DeviceView {
    const current = this.devices.get(id);
    if (!current) {
      throw new NotFoundException(`Device ${id} was not found`);
    }

    const mergedPayload: DeviceUpsertPayload = {
      ...this.toDeviceView(current),
      ...payload,
      id,
    };

    const updated = this.buildRecord(mergedPayload);
    this.devices.set(id, updated);

    return this.toDeviceView(updated);
  }

  private buildRecord(payload: DeviceUpsertPayload): DeviceRecord {
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

    const telemetry = createDeviceTelemetryData({
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
      animalId,
      telemetry,
      lastPing: new Date().toISOString(),
    };
  }

  private toDeviceView(record: DeviceRecord): DeviceView {
    return {
      id: record.telemetry.device_id,
      animalId: record.animalId,
      battery: record.telemetry.battery.level,
      signal: this.rssiToSignalPercent(record.telemetry.connectivity.rssi),
      status: this.mapBatteryToStatus(record.telemetry.battery.status),
      lastPing: record.lastPing,
      hardwareVersion: record.telemetry.hardware_version,
      solarCharging: record.telemetry.battery.solar_charging,
      protocol: record.telemetry.connectivity.protocol,
      lastSyncMode: record.telemetry.connectivity.last_sync_mode,
      gatewayId: record.telemetry.connectivity.gateway_id,
      alertsCount: record.telemetry.alerts_count,
    };
  }

  private signalPercentToRssi(signalPercent: number): number {
    const normalized = Math.max(0, Math.min(100, signalPercent));
    return Math.round(-120 + normalized * 0.7);
  }

  private rssiToSignalPercent(rssi: number): number {
    const raw = Math.round(((rssi + 120) / 70) * 100);
    return Math.max(0, Math.min(100, raw));
  }

  private mapStatusToBattery(status: DeviceStatus): DeviceTelemetryMock['battery']['status'] {
    if (status === 'critical') {
      return 'critical';
    }
    if (status === 'warning') {
      return 'low';
    }
    return 'normal';
  }

  private mapBatteryToStatus(status: DeviceTelemetryMock['battery']['status']): DeviceStatus {
    if (status === 'critical') {
      return 'critical';
    }
    if (status === 'low') {
      return 'warning';
    }
    return 'active';
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
    throw new BadRequestException(`Field ${field} must be LoRaWAN, LTE or NB-IoT`);
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

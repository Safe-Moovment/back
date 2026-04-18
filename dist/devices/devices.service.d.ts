import { Model } from 'mongoose';
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
export declare class DevicesService {
    private readonly deviceModel;
    constructor(deviceModel: Model<Device>);
    list(): Promise<DeviceView[]>;
    create(payload: DeviceUpsertPayload): Promise<DeviceView>;
    update(id: string, payload: DeviceUpsertPayload): Promise<DeviceView>;
    private buildRecord;
    private toDeviceView;
    private signalPercentToRssi;
    private mapStatusToBattery;
    private requireString;
    private requireNumber;
    private requireDate;
    private requireStatus;
    private requireBoolean;
    private requireProtocol;
    private requireSyncMode;
}
export {};

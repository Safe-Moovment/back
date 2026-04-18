import { DevicesService } from './devices.service';
type DeviceView = {
    id: string;
    animalId: string;
    battery: number;
    signal: number;
    status: 'active' | 'warning' | 'critical';
    lastPing: string;
    hardwareVersion: string;
    solarCharging: boolean;
    protocol: 'LoRaWAN' | 'LTE' | 'NB-IoT';
    lastSyncMode: 'Store & Forward' | 'Real-time';
    gatewayId: string;
    alertsCount: number;
};
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    list(): Promise<DeviceView[]>;
    create(payload: Partial<DeviceView>): Promise<DeviceView>;
    update(id: string, payload: Partial<Omit<DeviceView, 'id'>>): Promise<DeviceView>;
}
export {};

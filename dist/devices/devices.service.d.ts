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
    private readonly devices;
    list(): DeviceView[];
    create(payload: DeviceUpsertPayload): DeviceView;
    update(id: string, payload: DeviceUpsertPayload): DeviceView;
    private buildRecord;
    private toDeviceView;
    private signalPercentToRssi;
    private rssiToSignalPercent;
    private mapStatusToBattery;
    private mapBatteryToStatus;
    private requireString;
    private requireNumber;
    private requireStatus;
    private requireBoolean;
    private requireProtocol;
    private requireSyncMode;
}
export {};

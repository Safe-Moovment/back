"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const health_biometric_mock_1 = require("../mocks/health-biometric.mock");
let DevicesService = class DevicesService {
    devices = new Map();
    list() {
        return Array.from(this.devices.values()).map((record) => this.toDeviceView(record));
    }
    create(payload) {
        const id = this.requireString(payload.id, 'id');
        if (this.devices.has(id)) {
            throw new common_1.BadRequestException(`Device ${id} already exists`);
        }
        const record = this.buildRecord(payload);
        this.devices.set(id, record);
        return this.toDeviceView(record);
    }
    update(id, payload) {
        const current = this.devices.get(id);
        if (!current) {
            throw new common_1.NotFoundException(`Device ${id} was not found`);
        }
        const mergedPayload = {
            ...this.toDeviceView(current),
            ...payload,
            id,
        };
        const updated = this.buildRecord(mergedPayload);
        this.devices.set(id, updated);
        return this.toDeviceView(updated);
    }
    buildRecord(payload) {
        const id = this.requireString(payload.id, 'id');
        const batteryLevel = this.requireNumber(payload.battery, 'battery');
        const signalPercent = this.requireNumber(payload.signal, 'signal');
        const status = this.requireStatus(payload.status, 'status');
        const animalId = this.requireString(payload.animalId, 'animalId');
        const hardwareVersion = this.requireString(payload.hardwareVersion, 'hardwareVersion');
        const solarCharging = this.requireBoolean(payload.solarCharging, 'solarCharging');
        const protocol = this.requireProtocol(payload.protocol, 'protocol');
        const lastSyncMode = this.requireSyncMode(payload.lastSyncMode, 'lastSyncMode');
        const gatewayId = this.requireString(payload.gatewayId, 'gatewayId');
        const alertsCount = this.requireNumber(payload.alertsCount, 'alertsCount');
        const telemetry = (0, health_biometric_mock_1.createDeviceTelemetryData)({
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
    toDeviceView(record) {
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
    signalPercentToRssi(signalPercent) {
        const normalized = Math.max(0, Math.min(100, signalPercent));
        return Math.round(-120 + normalized * 0.7);
    }
    rssiToSignalPercent(rssi) {
        const raw = Math.round(((rssi + 120) / 70) * 100);
        return Math.max(0, Math.min(100, raw));
    }
    mapStatusToBattery(status) {
        if (status === 'critical') {
            return 'critical';
        }
        if (status === 'warning') {
            return 'low';
        }
        return 'normal';
    }
    mapBatteryToStatus(status) {
        if (status === 'critical') {
            return 'critical';
        }
        if (status === 'low') {
            return 'warning';
        }
        return 'active';
    }
    requireString(value, field) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new common_1.BadRequestException(`Field ${field} is required`);
        }
        return value.trim();
    }
    requireNumber(value, field) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new common_1.BadRequestException(`Field ${field} must be a valid number`);
        }
        return value;
    }
    requireStatus(value, field) {
        if (value === 'active' || value === 'warning' || value === 'critical') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be active, warning or critical`);
    }
    requireBoolean(value, field) {
        if (typeof value !== 'boolean') {
            throw new common_1.BadRequestException(`Field ${field} must be boolean`);
        }
        return value;
    }
    requireProtocol(value, field) {
        if (value === 'LoRaWAN' || value === 'LTE' || value === 'NB-IoT') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be LoRaWAN, LTE or NB-IoT`);
    }
    requireSyncMode(value, field) {
        if (value === 'Store & Forward' || value === 'Real-time') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be Store & Forward or Real-time`);
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)()
], DevicesService);
//# sourceMappingURL=devices.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const health_biometric_mock_1 = require("../mocks/health-biometric.mock");
const device_schema_1 = require("./schemas/device.schema");
let DevicesService = class DevicesService {
    deviceModel;
    constructor(deviceModel) {
        this.deviceModel = deviceModel;
    }
    async list() {
        const rows = await this.deviceModel.find().sort({ updatedAt: -1 }).lean();
        return rows.map((row) => this.toDeviceView(row));
    }
    async create(payload) {
        const id = this.requireString(payload.id, 'id');
        if (await this.deviceModel.exists({ id })) {
            throw new common_1.ConflictException(`Device ${id} already exists`);
        }
        const record = this.buildRecord({ ...payload, id });
        const created = await this.deviceModel.create(record);
        return this.toDeviceView(created.toObject());
    }
    async update(id, payload) {
        const current = await this.deviceModel.findOne({ id }).lean();
        if (!current) {
            throw new common_1.NotFoundException(`Device ${id} was not found`);
        }
        const mergedPayload = {
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
            throw new common_1.NotFoundException(`Device ${id} was not found`);
        }
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
        (0, health_biometric_mock_1.createDeviceTelemetryData)({
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
        };
    }
    toDeviceView(row) {
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
    signalPercentToRssi(signalPercent) {
        const normalized = Math.max(0, Math.min(100, signalPercent));
        return Math.round(-120 + normalized * 0.7);
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
    requireDate(value, field) {
        if (typeof value !== 'string') {
            throw new common_1.BadRequestException(`Field ${field} must be a valid ISO date string`);
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException(`Field ${field} must be a valid ISO date string`);
        }
        return parsed;
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
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(device_schema_1.Device.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DevicesService);
//# sourceMappingURL=devices.service.js.map
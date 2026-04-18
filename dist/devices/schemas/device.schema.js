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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSchema = exports.Device = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Device = class Device {
    id;
    animalId;
    battery;
    signal;
    status;
    lastPing;
    hardwareVersion;
    solarCharging;
    protocol;
    lastSyncMode;
    gatewayId;
    alertsCount;
};
exports.Device = Device;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Device.prototype, "animalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Device.prototype, "battery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Device.prototype, "signal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['active', 'warning', 'critical'] }),
    __metadata("design:type", String)
], Device.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Device.prototype, "lastPing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Device.prototype, "hardwareVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Device.prototype, "solarCharging", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['LoRaWAN', 'LTE', 'NB-IoT'] }),
    __metadata("design:type", String)
], Device.prototype, "protocol", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Store & Forward', 'Real-time'] }),
    __metadata("design:type", String)
], Device.prototype, "lastSyncMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Device.prototype, "gatewayId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Device.prototype, "alertsCount", void 0);
exports.Device = Device = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'devices' })
], Device);
exports.DeviceSchema = mongoose_1.SchemaFactory.createForClass(Device);
//# sourceMappingURL=device.schema.js.map
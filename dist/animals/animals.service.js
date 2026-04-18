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
exports.AnimalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const animal_schema_1 = require("./schemas/animal.schema");
let AnimalsService = class AnimalsService {
    animalModel;
    constructor(animalModel) {
        this.animalModel = animalModel;
    }
    async list() {
        const rows = await this.animalModel.find().sort({ updatedAt: -1 }).lean();
        return rows.map((row) => this.toView(row));
    }
    async create(payload) {
        const id = this.requireString(payload.id, 'id');
        if (await this.animalModel.exists({ id })) {
            throw new common_1.ConflictException(`Animal ${id} already exists`);
        }
        const record = this.buildAnimalRecord({ ...payload, id });
        const created = await this.animalModel.create(record);
        return this.toView(created.toObject());
    }
    async update(id, payload) {
        const current = await this.animalModel.findOne({ id }).lean();
        if (!current) {
            throw new common_1.NotFoundException(`Animal ${id} was not found`);
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
            throw new common_1.NotFoundException(`Animal ${id} was not found`);
        }
        return this.toView(updated);
    }
    toView(row) {
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
    buildAnimalRecord(payload) {
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
        };
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
    requireHealth(value, field) {
        if (value === 'Excelente' ||
            value === 'Buena' ||
            value === 'Atención' ||
            value === 'Alerta') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be Excelente, Buena, Atención or Alerta`);
    }
    requireStatus(value, field) {
        if (value === 'ok' || value === 'alert') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be ok or alert`);
    }
};
exports.AnimalsService = AnimalsService;
exports.AnimalsService = AnimalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(animal_schema_1.Animal.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AnimalsService);
//# sourceMappingURL=animals.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalsService = void 0;
const common_1 = require("@nestjs/common");
let AnimalsService = class AnimalsService {
    animals = new Map();
    list() {
        return Array.from(this.animals.values());
    }
    create(payload) {
        const animal = this.toAnimal(payload);
        if (this.animals.has(animal.id)) {
            throw new common_1.BadRequestException(`Animal ${animal.id} already exists`);
        }
        this.animals.set(animal.id, animal);
        return animal;
    }
    update(id, payload) {
        const current = this.animals.get(id);
        if (!current) {
            throw new common_1.NotFoundException(`Animal ${id} was not found`);
        }
        const merged = this.toAnimal({ ...current, ...payload, id });
        this.animals.set(id, merged);
        return merged;
    }
    toAnimal(payload) {
        return {
            id: this.requireString(payload.id, 'id'),
            name: this.requireString(payload.name, 'name'),
            lat: this.requireNumber(payload.lat, 'lat'),
            lng: this.requireNumber(payload.lng, 'lng'),
            health: this.requireHealth(payload.health, 'health'),
            battery: this.requireNumber(payload.battery, 'battery'),
            temp: this.requireNumber(payload.temp, 'temp'),
            lastUpdate: this.requireString(payload.lastUpdate, 'lastUpdate'),
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
    (0, common_1.Injectable)()
], AnimalsService);
//# sourceMappingURL=animals.service.js.map
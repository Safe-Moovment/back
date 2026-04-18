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
exports.FencesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fence_schema_1 = require("./schemas/fence.schema");
let FencesService = class FencesService {
    fenceModel;
    constructor(fenceModel) {
        this.fenceModel = fenceModel;
    }
    async list() {
        const rows = await this.fenceModel.find().sort({ updatedAt: -1 }).lean();
        return rows.map((row) => this.toView(row));
    }
    async create(payload) {
        const id = this.requireString(payload.id, 'id');
        if (await this.fenceModel.exists({ id })) {
            throw new common_1.ConflictException(`Fence ${id} already exists`);
        }
        const created = await this.fenceModel.create(this.buildFenceRecord({ ...payload, id }));
        return this.toView(created.toObject());
    }
    async update(id, payload) {
        const current = await this.fenceModel.findOne({ id }).lean();
        if (!current) {
            throw new common_1.NotFoundException(`Fence ${id} was not found`);
        }
        const updated = await this.fenceModel
            .findOneAndUpdate({ id }, this.buildFenceRecord({ ...this.toView(current), ...payload, id }), { new: true })
            .lean();
        if (!updated) {
            throw new common_1.NotFoundException(`Fence ${id} was not found`);
        }
        return this.toView(updated);
    }
    async remove(id) {
        const result = await this.fenceModel.deleteOne({ id });
        if (!result.deletedCount) {
            throw new common_1.NotFoundException(`Fence ${id} was not found`);
        }
        return { deleted: true, id };
    }
    toView(row) {
        return {
            id: row.id,
            name: row.name,
            area: row.area,
            animals: row.animals,
            status: row.status,
            violations: row.violations,
            color: row.color,
            coordinates: row.coordinates.map((point) => [point[0], point[1]]),
        };
    }
    buildFenceRecord(payload) {
        return {
            id: this.requireString(payload.id, 'id'),
            name: this.requireString(payload.name, 'name'),
            area: this.requireString(payload.area, 'area'),
            animals: this.requireNumber(payload.animals, 'animals'),
            status: this.requireStatus(payload.status, 'status'),
            violations: this.requireNumber(payload.violations, 'violations'),
            color: this.requireString(payload.color, 'color'),
            coordinates: this.requireCoordinates(payload.coordinates, 'coordinates'),
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
    requireStatus(value, field) {
        if (value === 'active' || value === 'inactive') {
            return value;
        }
        throw new common_1.BadRequestException(`Field ${field} must be active or inactive`);
    }
    requireCoordinates(value, field) {
        if (!Array.isArray(value) || value.length < 3) {
            throw new common_1.BadRequestException(`Field ${field} must be an array with at least 3 points`);
        }
        return value.map((point, index) => {
            if (!Array.isArray(point) || point.length !== 2) {
                throw new common_1.BadRequestException(`Field ${field}[${index}] must be [lat, lng]`);
            }
            const lat = point[0];
            const lng = point[1];
            if (typeof lat !== 'number' || Number.isNaN(lat)) {
                throw new common_1.BadRequestException(`Field ${field}[${index}][0] must be number`);
            }
            if (typeof lng !== 'number' || Number.isNaN(lng)) {
                throw new common_1.BadRequestException(`Field ${field}[${index}][1] must be number`);
            }
            return [lat, lng];
        });
    }
};
exports.FencesService = FencesService;
exports.FencesService = FencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fence_schema_1.Fence.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FencesService);
//# sourceMappingURL=fences.service.js.map
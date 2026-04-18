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
exports.FenceSchema = exports.Fence = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Fence = class Fence {
    id;
    name;
    area;
    animals;
    status;
    violations;
    color;
    coordinates;
};
exports.Fence = Fence;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], Fence.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Fence.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Fence.prototype, "area", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Fence.prototype, "animals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['active', 'inactive'] }),
    __metadata("design:type", String)
], Fence.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Fence.prototype, "violations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Fence.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [[Number]], required: true }),
    __metadata("design:type", Array)
], Fence.prototype, "coordinates", void 0);
exports.Fence = Fence = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'fences' })
], Fence);
exports.FenceSchema = mongoose_1.SchemaFactory.createForClass(Fence);
//# sourceMappingURL=fence.schema.js.map
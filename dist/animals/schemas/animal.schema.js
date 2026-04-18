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
exports.AnimalSchema = exports.Animal = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Animal = class Animal {
    id;
    name;
    lat;
    lng;
    health;
    battery;
    temp;
    lastUpdate;
    status;
    locationText;
};
exports.Animal = Animal;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], Animal.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Animal.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Animal.prototype, "lat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Animal.prototype, "lng", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Excelente', 'Buena', 'Atención', 'Alerta'] }),
    __metadata("design:type", String)
], Animal.prototype, "health", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Animal.prototype, "battery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Animal.prototype, "temp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Animal.prototype, "lastUpdate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ok', 'alert'] }),
    __metadata("design:type", String)
], Animal.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Animal.prototype, "locationText", void 0);
exports.Animal = Animal = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'animals' })
], Animal);
exports.AnimalSchema = mongoose_1.SchemaFactory.createForClass(Animal);
//# sourceMappingURL=animal.schema.js.map
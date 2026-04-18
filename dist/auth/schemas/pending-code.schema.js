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
exports.PendingCodeSchema = exports.PendingCode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let PendingCode = class PendingCode {
    email;
    codeHash;
    expiresAt;
    issuedAt;
    verifiedAt;
    usedAt;
    status;
    purpose;
};
exports.PendingCode = PendingCode;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true, index: true }),
    __metadata("design:type", String)
], PendingCode.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PendingCode.prototype, "codeHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PendingCode.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PendingCode.prototype, "issuedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: false, default: null }),
    __metadata("design:type", Object)
], PendingCode.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: false, default: null }),
    __metadata("design:type", Object)
], PendingCode.prototype, "usedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'verified', 'used', 'expired'], default: 'pending' }),
    __metadata("design:type", String)
], PendingCode.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['registration', 'reset'] }),
    __metadata("design:type", String)
], PendingCode.prototype, "purpose", void 0);
exports.PendingCode = PendingCode = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false, collection: 'pending_codes' })
], PendingCode);
exports.PendingCodeSchema = mongoose_1.SchemaFactory.createForClass(PendingCode);
//# sourceMappingURL=pending-code.schema.js.map
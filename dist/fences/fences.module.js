"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FencesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fences_controller_1 = require("./fences.controller");
const fences_service_1 = require("./fences.service");
const fence_schema_1 = require("./schemas/fence.schema");
let FencesModule = class FencesModule {
};
exports.FencesModule = FencesModule;
exports.FencesModule = FencesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: fence_schema_1.Fence.name, schema: fence_schema_1.FenceSchema }])],
        controllers: [fences_controller_1.FencesController],
        providers: [fences_service_1.FencesService],
    })
], FencesModule);
//# sourceMappingURL=fences.module.js.map
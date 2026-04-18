"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_2 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const devices_module_1 = require("./devices/devices.module");
const animals_module_1 = require("./animals/animals.module");
const fences_module_1 = require("./fences/fences.module");
const elevation_module_1 = require("./elevation/elevation.module");
const mongo_connection_logger_1 = require("./mongo-connection.logger");
const logger = new common_1.Logger('AppModule');
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_2.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => {
                    const uri = process.env.MONGODB_URI?.trim();
                    if (!uri) {
                        logger.error('MONGODB_URI is missing. The backend cannot start without a database connection string.');
                        throw new Error('MONGODB_URI is required');
                    }
                    logger.log('MONGODB_URI detected. Initializing MongoDB connection.');
                    return { uri };
                },
            }),
            auth_module_1.AuthModule,
            devices_module_1.DevicesModule,
            animals_module_1.AnimalsModule,
            fences_module_1.FencesModule,
            elevation_module_1.ElevationModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, mongo_connection_logger_1.MongoConnectionLogger],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
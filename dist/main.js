"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const envCandidates = [(0, node_path_1.resolve)(process.cwd(), '.env'), (0, node_path_1.resolve)(process.cwd(), 'back/.env')];
for (const envPath of envCandidates) {
    if ((0, node_fs_1.existsSync)(envPath)) {
        (0, dotenv_1.config)({ path: envPath });
        break;
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true });
    const port = Number(process.env.PORT) || 3000;
    await app.listen(port);
}
bootstrap().catch((error) => {
    console.error('Bootstrap error:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map
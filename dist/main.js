"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const logger = new common_1.Logger('Bootstrap');
const envCandidates = [(0, node_path_1.resolve)(process.cwd(), '.env'), (0, node_path_1.resolve)(process.cwd(), 'back/.env')];
let loadedEnvPath = null;
for (const envPath of envCandidates) {
    if ((0, node_fs_1.existsSync)(envPath)) {
        (0, dotenv_1.config)({ path: envPath });
        loadedEnvPath = envPath;
        logger.log(`Loaded environment file: ${envPath}`);
        break;
    }
}
if (!loadedEnvPath) {
    logger.warn('No local .env file found. Render environment variables will be used if available.');
}
logger.log(`Environment check -> MONGODB_URI=${process.env.MONGODB_URI ? 'set' : 'missing'}, ` +
    `SMTP_USER=${process.env.SMTP_USER ? 'set' : 'missing'}, ` +
    `SMTP_PASS=${process.env.SMTP_PASS ? 'set' : 'missing'}, ` +
    `PORT=${process.env.PORT ? 'set' : 'missing'}`);
async function bootstrap() {
    logger.log('Creating Nest application...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true });
    const port = Number(process.env.PORT) || 3000;
    logger.log(`Starting HTTP server on port ${port}...`);
    await app.listen(port);
    logger.log(`Backend ready on port ${port}`);
}
bootstrap().catch((error) => {
    logger.error('Bootstrap error:', error instanceof Error ? error.stack ?? error.message : String(error));
    process.exit(1);
});
//# sourceMappingURL=main.js.map
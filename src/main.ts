import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');
const envCandidates = [resolve(process.cwd(), '.env'), resolve(process.cwd(), 'back/.env')];
let loadedEnvPath: string | null = null;

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    loadEnv({ path: envPath });
    loadedEnvPath = envPath;
    logger.log(`Loaded environment file: ${envPath}`);
    break;
  }
}

if (!loadedEnvPath) {
  logger.warn('No local .env file found. Render environment variables will be used if available.');
}

logger.log(
  `Environment check -> MONGODB_URI=${process.env.MONGODB_URI ? 'set' : 'missing'}, ` +
    `SMTP_USER=${process.env.SMTP_USER ? 'set' : 'missing'}, ` +
    `SMTP_PASS=${process.env.SMTP_PASS ? 'set' : 'missing'}, ` +
    `PORT=${process.env.PORT ? 'set' : 'missing'}`,
);

async function bootstrap() {
  logger.log('Creating Nest application...');
  const app = await NestFactory.create(AppModule);
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

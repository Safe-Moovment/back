import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const envCandidates = [resolve(process.cwd(), '.env'), resolve(process.cwd(), 'back/.env')];
for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    loadEnv({ path: envPath });
    break;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});

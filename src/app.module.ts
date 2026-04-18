import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { AnimalsModule } from './animals/animals.module';
import { FencesModule } from './fences/fences.module';
import { ElevationModule } from './elevation/elevation.module';
import { MongoConnectionLogger } from './mongo-connection.logger';

const logger = new Logger('AppModule');

@Module({
  imports: [
    MongooseModule.forRootAsync({
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
    AuthModule,
    DevicesModule,
    AnimalsModule,
    FencesModule,
    ElevationModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongoConnectionLogger],
})
export class AppModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { AnimalsModule } from './animals/animals.module';
import { FencesModule } from './fences/fences.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI?.trim();
        if (!uri) {
          throw new Error('MONGODB_URI is required');
        }

        return { uri };
      },
    }),
    AuthModule,
    DevicesModule,
    AnimalsModule,
    FencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

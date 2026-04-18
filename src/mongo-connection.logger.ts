import { InjectConnection } from '@nestjs/mongoose';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Connection } from 'mongoose';

@Injectable()
export class MongoConnectionLogger implements OnApplicationBootstrap {
  private readonly logger = new Logger(MongoConnectionLogger.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationBootstrap(): void {
    this.logger.log(`MongoDB readyState at bootstrap: ${this.connection.readyState}`);

    this.connection.on('connected', () => {
      this.logger.log('MongoDB connection established.');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB connection disconnected.');
    });

    this.connection.on('error', (error: Error) => {
      this.logger.error('MongoDB connection error.', error.stack ?? error.message);
    });
  }
}
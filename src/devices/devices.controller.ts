import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';

type DeviceView = {
  id: string;
  animalId: string;
  battery: number;
  signal: number;
  status: 'active' | 'warning' | 'critical';
  lastPing: string;
  hardwareVersion: string;
  solarCharging: boolean;
  protocol: 'LoRaWAN' | 'LTE' | 'NB-IoT';
  lastSyncMode: 'Store & Forward' | 'Real-time';
  gatewayId: string;
  alertsCount: number;
};

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  async list(): Promise<DeviceView[]> {
    return await this.devicesService.list();
  }

  @Post()
  async create(@Body() payload: Partial<DeviceView>): Promise<DeviceView> {
    return await this.devicesService.create(payload);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<Omit<DeviceView, 'id'>>,
  ): Promise<DeviceView> {
    return await this.devicesService.update(id, payload);
  }
}

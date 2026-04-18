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
  list(): DeviceView[] {
    return this.devicesService.list();
  }

  @Post()
  create(@Body() payload: Partial<DeviceView>): DeviceView {
    return this.devicesService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: Partial<Omit<DeviceView, 'id'>>,
  ): DeviceView {
    return this.devicesService.update(id, payload);
  }
}

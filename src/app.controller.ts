import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext } from '@nestjs/microservices';
import { PublishService } from './publish.service';

@Controller()
export class AppController {
  constructor(private publishService: PublishService) {}
  @MessagePattern(
    'site/123/photovoltaic/skidControlUnits/01A/inverters/+/status',
  )
  async subscribe(@Ctx() context: MqttContext) {
    return this.publishService.handleMessage(context);
  }
}

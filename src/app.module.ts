import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboundResponseSerializer } from './utils/outbound-response.serializer';
import { PublishService } from './publish.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
          serializer: new OutboundResponseSerializer(),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [PublishService],
})
export class AppModule {}

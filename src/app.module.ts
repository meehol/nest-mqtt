import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboundResponseSerializer } from './outbound-response.serializer';

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
  controllers: [MqttController],
})
export class AppModule {}

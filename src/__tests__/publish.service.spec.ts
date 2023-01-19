import { Test, TestingModule } from '@nestjs/testing';
import { PublishService } from '../publish.service';
import { MqttContext } from '@nestjs/microservices/ctx-host/mqtt.context';
import configuration from '../config/configuration';

export const buildContext = (value) =>
  new MqttContext([
    configuration.childTopics[0],
    { payload: Buffer.from(value, 'utf-8') },
  ]);

describe('PublishService', () => {
  let service: PublishService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MQTT_SERVICE',
          useFactory: () => ({
            connect: jest.fn(),
            emit: jest.fn(),
          }),
        },
        PublishService,
      ],
    }).compile();

    service = module.get<PublishService>(PublishService);
  });

  it('PublishService - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('post "0" to parent topic if any child topic changes to "0" and all were equal to "1"', async () => {
    jest.spyOn(service, 'publishToParent');
    await service.handleMessage(buildContext('0'));
    expect(service.publishToParent).toHaveBeenCalledTimes(1);
    expect(service.publishToParent).toHaveBeenCalledWith('0');
  });

  it('post "1" to parent topic if any child topic changes to "1" and all are equal to "1"', async () => {
    jest.spyOn(service, 'publishToParent');
    await service.handleMessage(buildContext('0'));
    await service.handleMessage(buildContext('0'));
    await service.handleMessage(buildContext('1'));
    expect(service.publishToParent).toHaveBeenCalledTimes(2);
    expect(service.publishToParent).toHaveBeenCalledWith('1');
  });
});

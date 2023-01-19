import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from '../mqtt.controller';
import { MqttContext } from '@nestjs/microservices/ctx-host/mqtt.context';
import configuration from '../config/configuration';

describe('MqttController', () => {
  let controller: MqttController;

  const buildContext = (value) =>
    new MqttContext([
      configuration.childTopics[0],
      { payload: Buffer.from(value, 'utf-8') },
    ]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MQTT_SERVICE',
          useFactory: () => ({
            connect: jest.fn(),
            emit: jest.fn(),
          }),
        },
      ],
      controllers: [MqttController],
    }).compile();

    controller = module.get<MqttController>(MqttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('post "0" to parent topic if any child topic changes to "0" and all were equal to "1"', async () => {
    jest.spyOn(controller, 'publishToParent');
    await controller.subscribe(buildContext('0'));
    expect(controller.publishToParent).toHaveBeenCalledTimes(1);
    expect(controller.publishToParent).toHaveBeenCalledWith('0');
  });

  it('post "1" to parent topic if any child topic changes to "1" and all are equal to "1"', async () => {
    jest.spyOn(controller, 'publishToParent');
    await controller.subscribe(buildContext('0'));
    await controller.subscribe(buildContext('0'));
    await controller.subscribe(buildContext('1'));
    expect(controller.publishToParent).toHaveBeenCalledTimes(2);
    expect(controller.publishToParent).toHaveBeenCalledWith('1');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { PublishService } from '../publish.service';
import { buildContext } from './publish.service.spec';

describe('MqttController', () => {
  let controller: AppController;

  beforeAll(async () => {
    const PublishServiceProvider = {
      provide: PublishService,
      useFactory: () => ({
        handleMessage: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MQTT_SERVICE',
          useFactory: () => ({
            connect: jest.fn(),
            emit: jest.fn(),
          }),
        },
        PublishServiceProvider,
      ],
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return from subscribe', async () => {
    await expect(
      controller.subscribe(buildContext('0')),
    ).resolves.not.toThrow();
  });
});

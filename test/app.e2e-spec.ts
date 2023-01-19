import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PublishService } from '../src/publish.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const PublishServiceProvider = {
      provide: PublishService,
      useFactory: () => ({
        handleMessage: jest.fn(() => []),
      }),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('is compiling', () => {
    expect(app).toBeDefined();
  });
});

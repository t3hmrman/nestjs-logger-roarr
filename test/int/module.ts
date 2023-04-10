import { describe, test, it, expect } from "vitest"
import { Test } from '@nestjs/testing';
import { Module } from '@nestjs/common';

import { RoarrLoggerModule } from '../../lib/module';
import { ModuleOptions, OptionsFactory } from '../../lib/types';
import { RoarrLoggerService } from '../../lib/service';
import { MODULE_TOKEN } from '../../lib/constants';

describe('Module', () => {
  let config: ModuleOptions = {
    environment: 'test',
  }

  // create a service service that does notthing but create
  class TestRoarrLoggerService implements OptionsFactory {
    createOptions(): ModuleOptions {
      return config;
    }
  }

  // Create a module that uses the test service
  @Module({
    exports: [TestRoarrLoggerService],
    providers: [TestRoarrLoggerService]
  })
  class TestModule {}

  test('forRoot()', async () => {
    const mod = await Test.createTestingModule({
      imports: [ RoarrLoggerModule.forRoot(config) ],
    }).compile();

    const logger = mod.get<RoarrLoggerService>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(RoarrLoggerService);
  });


  test('forRootAsync() w/out useFactory', async () => {
    const mod = await Test.createTestingModule({
      imports: [
        RoarrLoggerModule.forRootAsync({
          useClass: TestRoarrLoggerService
        })
      ]
    }).compile();

    const logger = mod.get<RoarrLoggerService>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(RoarrLoggerService);
  });

  test('forRootAsync() w/ useFactory', async () => {
    const mod = await Test.createTestingModule({
      imports: [
        RoarrLoggerModule.forRootAsync({
          useFactory: () => (config),
        }),
      ]
    }).compile();

    const logger = mod.get<RoarrLoggerService>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(RoarrLoggerService);
  });
});

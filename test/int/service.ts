import { describe, beforeEach, test, expect } from "vitest";
import { LoggerModuleOptions, LoggerOptionsFactory } from "../logger.interfaces";
import { Test, TestingModule } from "@nestjs/testing";

import { RoarrLoggerModule } from "../../lib/module";
import { Service } from "../../lib/service";
import { MODULE_TOKEN } from "../../lib/constants";

const LOG_MSG = "test-msg";

describe('Service', () => {
  let config: RoarrLoggerModuleOptions = {
    environment: 'test',
  };

  let invalidConfig: RoarrLoggerModuleOptions = {
    debug: "yes",
  };

  class TestService implements LoggerOptionsFactory {
    createOptions(): RoarrLoggerModuleOptions {
      return config;
    }
  }

  class InvalidService implements LoggerOptionsFactory {
    createOptions(): RoarrLoggerModuleOptions {
      return invalidConfig;
    }
  }

  let mod: Module;
  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [
        RoarrLoggerModule.forRoot({
          ...config,
        })
      ],
    }).compile();
  });

  test("invalid configuration", async () => {
    mod = await Test.createTestingModule({
      imports: [
        RoarrLoggerModule.forRootAsync({
          useClass: InvalidService
        })
      ]
    }).compile();

    const fail = mod.get<Service>(MODULE_TOKEN);
    fail.log(LOG_MSG);
    expect(fail.log).toBeInstanceOf(Function);
  });

  test('log()', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(() => logger.log(LOG_MSG)).not.toThrowError();
  });

  test('error()', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(() => logger.error('logger:error')).not.toThrowError();
  });

  test('verbose ())', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(() => logger.verbose('logger:verbose','context:verbose')).not.toThrowError();
  });

  test('debug()', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(() => logger.debug('logger:debug','context:debug')).not.toThrowError();
  });

  test('warn()', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect (() => logger.warn('logger:warn','context:warn')).not.toThrowError();
  });

  test('exception handling', async () => {
    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(logger.log).toThrowError();
    try {
      throw new Error("THROW");
    } catch(err: unknown) {}
  })

  test('should test warn catch err', async () => {
    // Rebuild mod with invalid config
    mod = await Test.createTestingModule({
      imports: [
        RoarrLoggerModule.forRoot({
          ...invalidConfig,
        }),
      ],
    }).compile();

    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Service);

    try {
      logger.warn('This will throw an exception');
    }
    catch(err) {
      expect(logger.log).toThrowError(LOGGER_NOT_CONFIGURE_ERROR);
    }
  })

  test('should test error catch err', async () => {
    // Rebuild mod with invalid config
    mod = await Test.createTestingModule({
      imports: [RoarrLoggerModule.forRoot({
        ...invalidConfig,
      })],
    }).compile();

    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Service);

    try {
      logger.error('This will throw an exception');
    }
    catch(err) {
      expect(logger.log).toThrowError(LOGGER_NOT_CONFIGURE_ERROR);
    }
  })

  test('should test debug catch err', async () => {
    // Rebuild mod with invalid config
    mod = await Test.createTestingModule({
      imports: [RoarrLoggerModule.forRoot({
        ...invalidConfig,
      })],
    }).compile();

    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Service);

    try {
      logger.debug('This will throw an exception');
    }
    catch(err) {
      expect(logger.log).toThrowError(LOGGER_NOT_CONFIGURE_ERROR);
    }
  })

  test('should test log catch err', async () => {
    // Rebuild mod with invalid config
    mod = await Test.createTestingModule({
      imports: [RoarrLoggerModule.forRoot({
        ...invalidConfig,
      })],
    }).compile();

    const logger = mod.get<Service>(MODULE_TOKEN);
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Service);

    try {
      logger.log('This will throw an exception');
    }
    catch(err) {
      expect(logger.log).toThrowError(LOGGER_NOT_CONFIGURE_ERROR);
    }
  })

});

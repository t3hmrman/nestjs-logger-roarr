import {
  Module,
  Global,
  Provider,
  Type,
  DynamicModule,
} from '@nestjs/common';
import {
  ModuleAsyncOptions,
  ModuleOptionsFactory,
  ModuleOptions,
} from './types';
import { Service } from './service';
import { createProvider } from './provider';
import { MODULE_OPTIONS, MODULE_TOKEN } from './constants';

@Global()
@Module({})
export class RoarrLoggerCoreModule {

  public static forRoot(options?: ModuleOptions): DynamicModule {
    const provider = createProvider(options);

    return {
      module: RoarrLoggerCoreModule,
      exports: [provider, Service],
      providers: [provider, Service],
    };
  }

  public static forRootAsync(
    options: ModuleAsyncOptions,
  ): DynamicModule {
    const provider: Provider = {
      inject: [MODULE_OPTIONS],
      provide: MODULE_TOKEN,
      useFactory: (options: ModuleOptions) => new Service(options),
    };

    return {
      exports: [provider, Service],
      imports: options.imports,
      module: RoarrLoggerCoreModule,
      providers: [
        ...this.createAsyncProviders(options),
        provider,
        Service,
      ],
    };
  }

  private static createAsyncProviders(
    options: ModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<ModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }
    const inject = [
      (options.useClass) as Type<ModuleOptionsFactory>,
    ];
    return {
      provide: MODULE_OPTIONS,
      useFactory: async (optionsFactory: ModuleOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject,
    };
  }
}

import { Module, DynamicModule } from '@nestjs/common';
import { RoarrLoggerCoreModule } from './core-module';
import { ModuleOptions, ModuleAsyncOptions } from './types';

@Module({})
export class RoarrLoggerModule {
  public static forRoot(options?: ModuleOptions): DynamicModule {
    return {
      module: RoarrLoggerModule,
      imports: [ RoarrLoggerCoreModule.forRoot(options) ],
    };
  }

  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    return {
      module: RoarrLoggerModule,
      imports: [ RoarrLoggerCoreModule.forRootAsync(options) ],
    };
  }
}

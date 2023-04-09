import { DynamicModule } from '@nestjs/common';
import { ModuleOptions, ModuleAsyncOptions } from './types';
export declare class RoarrLoggerModule {
    static forRoot(options?: ModuleOptions): DynamicModule;
    static forRootAsync(options: ModuleAsyncOptions): DynamicModule;
}

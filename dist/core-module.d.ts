import { DynamicModule } from '@nestjs/common';
import { ModuleAsyncOptions, ModuleOptions } from './types';
export declare class RoarrLoggerCoreModule {
    static forRoot(options?: ModuleOptions): DynamicModule;
    static forRootAsync(options: ModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}

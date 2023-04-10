import { type Logger as RoarrLogger } from "roarr";
import { ConsoleLogger, OnApplicationShutdown, LogLevel } from '@nestjs/common';
import { ModuleOptions } from './types';
export declare class RoarrLoggerService extends ConsoleLogger implements OnApplicationShutdown {
    readonly opts?: ModuleOptions | undefined;
    app: string;
    private static singleton;
    logger: RoarrLogger;
    protected onClose: () => Promise<void>;
    protected ctx: Map<string, any>;
    protected logLevel: LogLevel;
    protected logLevelNum: number;
    constructor(opts?: ModuleOptions | undefined);
    static sharedInstance(options?: ModuleOptions): RoarrLoggerService;
    protected printMessages(messages: unknown[], context?: string, level?: LogLevel, writeStreamType?: 'stdout' | 'stderr'): void;
    onApplicationShutdown(signal?: string): Promise<void>;
}

import { Injectable, LogLevel } from "@nestjs/common";
import { Type } from "@nestjs/common/interfaces";
export declare class ModuleOptions {
    logLevel?: LogLevel;
    debug?: boolean;
    ctx?: Map<string, any>;
    onClose?: () => Promise<void>;
    useFactory?: (...args: any[]) => any;
    useSingleton?: boolean;
    static default(): ModuleOptions;
}
export declare class ModuleAsyncOptions {
    imports: any[];
    useClass?: Type<ModuleOptionsFactory>;
    useFactory?: (...args: any[]) => any;
    inject: Array<typeof Injectable>;
}
export interface ModuleOptionsFactory {
    createOptions(): Promise<ModuleOptions> | ModuleOptions;
}

import { Module, Injectable, LogLevel } from "@nestjs/common";
import { ModuleMetadata, Type } from "@nestjs/common/interfaces";

type NestJSImportsType = Pick<ModuleMetadata, 'imports'>;

export class  ModuleOptions {
  // Minimum log level to display
  public logLevel?: LogLevel = 'log';
  // Whether to enable debugging
  public debug?: boolean = false;
  // Context to pass through
  public ctx?: Map<string, any> = new Map();
  // Function to call upon close
  public onClose?: () => Promise<void> = () => Promise.resolve();
  // Factory to use
  public useFactory?: (...args: any[]) => any;
  // Use the singleton instance (creating it if necessary)
  public useSingleton?: boolean = true;

  static default(): ModuleOptions {
    return new ModuleOptions();
  }
}

export class ModuleAsyncOptions {
  public imports: any[] = [];
  public useClass?: Type<ModuleOptionsFactory>;
  public useFactory?: (...args: any[]) => any;
  public inject: Array<typeof Injectable> = [];
}

export interface ModuleOptionsFactory {
    createOptions(): Promise<ModuleOptions> | ModuleOptions;
}

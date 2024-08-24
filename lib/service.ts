import * as util from "node:util";
import {
  type Logger as RoarrLogger,
  Roarr as BASE_ROARR_LOGGER,
 } from "roarr";
import { Inject, Injectable, ConsoleLogger, OnApplicationShutdown, LogLevel } from '@nestjs/common';
import { MODULE_OPTIONS } from './constants';
import { ModuleOptions } from './types';

const LOG_LEVEL_LOOKUP: Record<LogLevel, number> = {
  'verbose': 10, // 'trace' in roarr terms
  'debug': 20,   // 'debug' in roarr terms
  'log': 30,     // 'info' in roarr terms
  'warn': 40,    // 'warn' in roarr terms
  'error': 50,   // 'error' in roarr terms
  'fatal': 60,   // 'fatal' in roarr terms
};

@Injectable()
export class RoarrLoggerService extends ConsoleLogger implements OnApplicationShutdown {
  public app = 'nestjs-logger-roarr';
  private static singleton: RoarrLoggerService;

  protected _logger: RoarrLogger;
  protected onClose: () => Promise<void> = () => Promise.resolve();
  protected ctx: Map<string, any> = new Map();
  protected logLevel: LogLevel = 'log';
  protected logLevelNum: number = LOG_LEVEL_LOOKUP['log'];

  constructor(
    @Inject(MODULE_OPTIONS)
    readonly opts?: ModuleOptions,
  ) {
    super();

    if (opts) {
      if (opts.ctx) {
        this.ctx = new Map([ ...this.ctx, ...opts.ctx ]);
      }
      if (opts.onClose) { this.onClose = opts.onClose; }
      if (opts.logLevel) { this.logLevel = opts.logLevel; }
    }

    // Set log level
    this.logLevelNum = LOG_LEVEL_LOOKUP[this.logLevel] ?? LOG_LEVEL_LOOKUP['log'];

    // Extend existing context with more
    this._logger = BASE_ROARR_LOGGER.child({
      ...Object.fromEntries(this.ctx),
    });
  }

  // Create a singleton of this service
  public static sharedInstance(options?: ModuleOptions): RoarrLoggerService {
    if (!RoarrLoggerService.singleton) {
      RoarrLoggerService.singleton = new RoarrLoggerService(options);
    }
    return RoarrLoggerService.singleton;
  }

  protected printMessages(
    messages: unknown[],
    context = '',
    level: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    messages.forEach(obj => {
      let message: string | null = null;
      if (typeof obj === "string") {
        message = obj;
      } else if (obj instanceof Date) {
        message = obj.toISOString();
      } else if (obj && typeof obj === "object" && "toString" in obj && typeof obj.toString === "function") {
        try {
          message = obj.toString();
        } catch (err: unknown) {}
      } else {
        try {
          message = JSON.stringify(obj)
        } catch (err: unknown) {}
      }

      // At this point if we still don't have something printable, forget about it.
      if (!message) { return; }

      // Check log level
      const lvl = LOG_LEVEL_LOOKUP[level];
      if (lvl < this.logLevelNum) {
        return;
      }

      // Build message
      const ctx = {
        pid: process.pid,
        in: context, // NestJS context is a string
      };

      switch (lvl) {
        case LOG_LEVEL_LOOKUP['debug']:
          this._logger?.debug(ctx, message);
          break;

        case LOG_LEVEL_LOOKUP['log']:
          this._logger?.info(ctx, message);
          break;

        case LOG_LEVEL_LOOKUP['warn']:
          this._logger?.warn(ctx, message);
          break;

        case LOG_LEVEL_LOOKUP['error']:
          this._logger?.error(ctx, message);
          break;

        case LOG_LEVEL_LOOKUP['verbose']:
          this._logger?.trace(ctx, message);
          break;
      }
    });
  }

  // Handle application shutdown
  async onApplicationShutdown(signal?: string) {
    this._logger?.info("application shutdown detected...");
    if (this.onClose) { await this.onClose(); }
  }
}

import { Provider } from '@nestjs/common';
import { ModuleOptions } from './types';
import { MODULE_TOKEN } from './constants';
import { RoarrLoggerService } from './service';

export function createProvider(options?: ModuleOptions) : Provider {
  return {
    provide: MODULE_TOKEN,
    useValue: options?.useSingleton ? RoarrLoggerService.sharedInstance(options) : new RoarrLoggerService(options),
  }
}

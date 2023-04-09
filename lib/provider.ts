import { Provider } from '@nestjs/common';
import { ModuleOptions } from './types';
import { MODULE_TOKEN } from './constants';
import { Service } from './service';

export function createProvider(options?: ModuleOptions) : Provider {
  return {
    provide: MODULE_TOKEN,
    useValue: options?.useSingleton ? Service.sharedInstance(options) : new Service(options),
  }
}

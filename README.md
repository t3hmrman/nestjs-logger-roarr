<p align="center">
  <h3 align="center">
    nestjs-logger-roarr
  </h3>

  <p align="center">
    NestJS Logger integration for Roarr (compatible with ConsoleLogger and LoggerService)
  </p>
</p>

## Quickstart

### Install

```console
pnpm install nestjs-logger-roarr
```

### Setup

> **NOTE** Do not forget to set `ROARR_LOG=true` otherwise you will see no log messages!

To use the *same* logger for lower level NestJS code and your own:

```typescript
import { RoarrLoggerService } from nestjs-logger-roarr';
import { AppModule } from "app.module";

const logger = RoarrLoggerService.sharedInstance();
const app = await NestFactory.create(AppModule, { logger });
```

As you might expect, calling `RoarrLoggerService.sharedInstance()` multiple times returns the *same* `Service`.

If you'd like to use the module directly:

```typescript
import { Module } from '@nestjs/common';
import { RoarrLoggerModule } from 'nestjs-logger-roarr;

@Module({
  imports: [
    RoarrLoggerModule.forRoot(),
  ],
})
export class AppModule {}
```

Note that by importing the module, the lower level NestJS code will use *a possibly different logger*, while your `AppModule` will use `RoarrLoggerModule`. See the previously mentioned `.sharedInstance()` if you want *all* logged code to use the `RoarrLoggerService`.

If you'd like to do build the logger service asynchronously (for example to inject some options):

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config;
import { RoarrLoggerService } from 'nestjs-logger-roarr;

@Module({
  imports: [
    RoarrLoggerService.forRootAsync({
      imports: [ ConfigModule ],
      useFactory: async (cfg:ConfigService) => ({
        logLevel: 'debug',
        environment: cfg.get('ENVIRONMENT') ?? 'staging',
        ctx: { // Context that is set @ the top level
          appName: cfg.get('APP_NAME'),
        },
      }),
    })
  ]
})

export class AppModule {}
```

### Usage

You can use it from any place `Injectable`s are welcome:

```typescript
import { Injectable } from '@nestjs/common';
import { RoarrLoggerService } from 'nestjs-logger-roarr;

@Injectable()
export class AppService {
  public constructor(@Inject() private readonly logger: RoarrLoggerService) {}
}
```

You can use `RoarrLoggerService` just like the build in `Logger` via a property in `Injectable`s:

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Doing something...');
  }
}
```

> **Note** that `RoarrLoggerService` extends [`ConsoleLoggerService`][nestjs-code-ConsoleLoggerService] (which extends [`LoggerService`][nestjs-code-LoggerService]), so you can use it anywhere the other interfaces are expected/required.

[nestjs-code-ConsoleLoggerService]: https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
[nestjs-code-LoggerService]: https://github.com/nestjs/nest/blob/master/packages/common/services/logger.service.ts

# FAQ

## What will log messages look like?

In an example application, the usual startup logs look like this:

```
{"context":{"in":"NestFactory","logLevel":30,"pid":2225063},"message":"Starting Nest application...","sequence":"0","time":1681023672355,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"DBModule dependencies initialized","sequence":"1","time":1681023672368,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"OpenTelemetryModule dependencies initialized","sequence":"2","time":1681023672368,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"OpenTelemetryCoreModule dependencies initialized","sequence":"3","time":1681023672369,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"ConfigHostModule dependencies initialized","sequence":"4","time":1681023672376,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"ConfigModule dependencies initialized","sequence":"5","time":1681023672376,"version":"2.0.0"}
{"context":{"in":"InstanceLoader","logLevel":30,"pid":2225063},"message":"AppModule dependencies initialized","sequence":"6","time":1681023672376,"version":"2.0.0"}
{"context":{"in":"RoutesResolver","logLevel":30,"pid":2225063},"message":"AppController {/}:","sequence":"7","time":1681023672389,"version":"2.0.0"}
{"context":{"in":"RouterExplorer","logLevel":30,"pid":2225063},"message":"Mapped {/, GET} route","sequence":"8","time":1681023672390,"version":"2.0.0"}
{"context":{"in":"NestApplication","logLevel":30,"pid":2225063},"message":"Nest application successfully started","sequence":"9","time":1681023672392,"version":"2.0.0"}
{"context":{"in":"AppService","logLevel":30,"pid":2225063},"message":"running getHello!!!","sequence":"10","time":1681023676282,"version":"2.0.0"}
```

## Contributing

Contributions are always welcome!

1. Fork this repository
2. Create your feature/bugfix/etc branch (`git checkout -b feat/my-branch`)
3. Commit any changes to your branch
4. Run (and add) tests to ensure yoru changes work
5. Open a pull request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [gajus/roarr](https://github.com/gajus/roarr)

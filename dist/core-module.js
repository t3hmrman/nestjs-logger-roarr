"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var RoarrLoggerCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoarrLoggerCoreModule = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("./service");
const provider_1 = require("./provider");
const constants_1 = require("./constants");
let RoarrLoggerCoreModule = RoarrLoggerCoreModule_1 = class RoarrLoggerCoreModule {
    static forRoot(options) {
        const provider = (0, provider_1.createProvider)(options);
        return {
            module: RoarrLoggerCoreModule_1,
            exports: [provider, service_1.Service],
            providers: [provider, service_1.Service],
        };
    }
    static forRootAsync(options) {
        const provider = {
            inject: [constants_1.MODULE_OPTIONS],
            provide: constants_1.MODULE_TOKEN,
            useFactory: (options) => new service_1.Service(options),
        };
        return {
            exports: [provider, service_1.Service],
            imports: options.imports,
            module: RoarrLoggerCoreModule_1,
            providers: [
                ...this.createAsyncProviders(options),
                provider,
                service_1.Service,
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                inject: options.inject || [],
                provide: constants_1.MODULE_OPTIONS,
                useFactory: options.useFactory,
            };
        }
        const inject = [
            (options.useClass),
        ];
        return {
            provide: constants_1.MODULE_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createOptions(); }),
            inject,
        };
    }
};
RoarrLoggerCoreModule = RoarrLoggerCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RoarrLoggerCoreModule);
exports.RoarrLoggerCoreModule = RoarrLoggerCoreModule;

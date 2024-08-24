"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var RoarrLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoarrLoggerService = void 0;
const roarr_1 = require("roarr");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const types_1 = require("./types");
const LOG_LEVEL_LOOKUP = {
    'verbose': 10,
    'debug': 20,
    'log': 30,
    'warn': 40,
    'error': 50,
    'fatal': 60,
};
let RoarrLoggerService = RoarrLoggerService_1 = class RoarrLoggerService extends common_1.ConsoleLogger {
    constructor(opts) {
        var _a;
        super();
        this.opts = opts;
        this.app = 'nestjs-logger-roarr';
        this.onClose = () => Promise.resolve();
        this.ctx = new Map();
        this.logLevel = 'log';
        this.logLevelNum = LOG_LEVEL_LOOKUP['log'];
        if (opts) {
            if (opts.ctx) {
                this.ctx = new Map([...this.ctx, ...opts.ctx]);
            }
            if (opts.onClose) {
                this.onClose = opts.onClose;
            }
            if (opts.logLevel) {
                this.logLevel = opts.logLevel;
            }
        }
        this.logLevelNum = (_a = LOG_LEVEL_LOOKUP[this.logLevel]) !== null && _a !== void 0 ? _a : LOG_LEVEL_LOOKUP['log'];
        this._logger = roarr_1.Roarr.child(Object.assign({}, Object.fromEntries(this.ctx)));
    }
    static sharedInstance(options) {
        if (!RoarrLoggerService_1.singleton) {
            RoarrLoggerService_1.singleton = new RoarrLoggerService_1(options);
        }
        return RoarrLoggerService_1.singleton;
    }
    printMessages(messages, context = '', level = 'log', writeStreamType) {
        messages.forEach(obj => {
            var _a, _b, _c, _d, _e;
            let message = null;
            if (typeof obj === "string") {
                message = obj;
            }
            else if (obj instanceof Date) {
                message = obj.toISOString();
            }
            else if (obj && typeof obj === "object" && "toString" in obj && typeof obj.toString === "function") {
                try {
                    message = obj.toString();
                }
                catch (err) { }
            }
            else {
                try {
                    message = JSON.stringify(obj);
                }
                catch (err) { }
            }
            if (!message) {
                return;
            }
            const lvl = LOG_LEVEL_LOOKUP[level];
            if (lvl < this.logLevelNum) {
                return;
            }
            const ctx = {
                pid: process.pid,
                in: context,
            };
            switch (lvl) {
                case LOG_LEVEL_LOOKUP['debug']:
                    (_a = this._logger) === null || _a === void 0 ? void 0 : _a.debug(ctx, message);
                    break;
                case LOG_LEVEL_LOOKUP['log']:
                    (_b = this._logger) === null || _b === void 0 ? void 0 : _b.info(ctx, message);
                    break;
                case LOG_LEVEL_LOOKUP['warn']:
                    (_c = this._logger) === null || _c === void 0 ? void 0 : _c.warn(ctx, message);
                    break;
                case LOG_LEVEL_LOOKUP['error']:
                    (_d = this._logger) === null || _d === void 0 ? void 0 : _d.error(ctx, message);
                    break;
                case LOG_LEVEL_LOOKUP['verbose']:
                    (_e = this._logger) === null || _e === void 0 ? void 0 : _e.trace(ctx, message);
                    break;
            }
        });
    }
    onApplicationShutdown(signal) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.info("application shutdown detected...");
            if (this.onClose) {
                yield this.onClose();
            }
        });
    }
};
exports.RoarrLoggerService = RoarrLoggerService;
exports.RoarrLoggerService = RoarrLoggerService = RoarrLoggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.MODULE_OPTIONS)),
    __metadata("design:paramtypes", [types_1.ModuleOptions])
], RoarrLoggerService);

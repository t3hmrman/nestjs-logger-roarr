"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProvider = void 0;
const constants_1 = require("./constants");
const service_1 = require("./service");
function createProvider(options) {
    return {
        provide: constants_1.MODULE_TOKEN,
        useValue: (options === null || options === void 0 ? void 0 : options.useSingleton) ? service_1.RoarrLoggerService.sharedInstance(options) : new service_1.RoarrLoggerService(options),
    };
}
exports.createProvider = createProvider;

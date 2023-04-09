"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleAsyncOptions = exports.ModuleOptions = void 0;
class ModuleOptions {
    constructor() {
        this.logLevel = 'log';
        this.debug = false;
        this.ctx = new Map();
        this.onClose = () => Promise.resolve();
        this.useSingleton = true;
    }
    static default() {
        return new ModuleOptions();
    }
}
exports.ModuleOptions = ModuleOptions;
class ModuleAsyncOptions {
    constructor() {
        this.imports = [];
        this.inject = [];
    }
}
exports.ModuleAsyncOptions = ModuleAsyncOptions;

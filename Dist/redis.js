"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const redis_1 = require("redis");
class Redis {
    constructor() {
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = yield (0, redis_1.createClient)();
                yield this.client.connect();
                console.log("Redis is ok");
            }
            catch (error) {
                console.log(error);
                console.log("Redis error");
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.client.get(key);
            return value; // return undefined if value not exist
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.set(key, value);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.Redis = Redis;

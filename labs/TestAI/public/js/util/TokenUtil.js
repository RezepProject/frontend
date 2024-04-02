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
exports.TokenUtil = void 0;
class TokenUtil {
    constructor() {
        this.token = null;
    }
    setToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const route = "http://localhost:5260";
            let resToken = yield fetch(route + "/authentication", {
                method: "POST",
                body: JSON.stringify({
                    "userIdentificator": "test",
                    "password": "test"
                }),
                headers: {
                    "Content-type": "application/json"
                }
            });
            this.token = yield resToken.text();
        });
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!TokenUtil.instance) {
                TokenUtil.instance = new TokenUtil();
                yield TokenUtil.instance.setToken();
            }
            return TokenUtil.instance;
        });
    }
    getToken() {
        return this.token;
    }
}
exports.TokenUtil = TokenUtil;
TokenUtil.instance = null;

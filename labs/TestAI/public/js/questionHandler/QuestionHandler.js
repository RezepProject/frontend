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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const TokenUtil_1 = require("../util/TokenUtil");
class QuestionHandler {
    constructor() {
        this.sessionId = null;
        this.timer = null;
        this.lock = false;
    }
    static getInstance() {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }
    getAnswerFromAi(question) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lock) {
                return undefined;
            }
            this.lock = true;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(yield TokenUtil_1.TokenUtil.getInstance()).getToken()}`
                }
            };
            try {
                const response = yield axios_1.default.post('http://localhost:5260/assistantairouter', {
                    question: question,
                    sessionId: this.sessionId
                }, config);
                if (!this.sessionId) {
                    this.sessionId = response.data.sessionId;
                }
                this.lock = false;
                return response.data.answer;
            }
            catch (error) {
                console.error('Error:', error);
                return undefined;
            }
            //uhrzeit abchecken alternative
        });
    }
}
exports.QuestionHandler = QuestionHandler;
QuestionHandler.instance = null;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export class QuestionHandler {
    constructor() {
        this.sessionId = null;
        this.timer = null;
    }
    static getInstance() {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }
    getAnswerFromAi(question) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.sessionId = null;
            }, 60000);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(yield TokenUtil.getInstance()).getToken()}`
                }
            };
            try {
                console.log('Sending response');
                const response = yield axios.post('http://localhost:5260/assistantairouter', {
                    question: question,
                    sessionId: this.sessionId
                }, config);
                if (!this.sessionId) {
                    this.sessionId = response.data.sessionId;
                }
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
QuestionHandler.instance = null;

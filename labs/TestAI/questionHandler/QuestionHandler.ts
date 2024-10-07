import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { TokenUtil } from '../util/TokenUtil'

export class QuestionHandler {
    private static instance: QuestionHandler | null = null;
    private sessionId: string | null = null;
    private timer: NodeJS.Timeout | null = null;
    private lock: boolean = false;

    public static getInstance(): QuestionHandler {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }

    public async getAnswerFromAi(question: string): Promise<string | undefined> {

        if(this.lock) {
            return undefined;
        }

        this.lock = true;

        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await TokenUtil.getInstance()).getToken()}`
            }
        };

        try {

            const response: AxiosResponse<any> = await axios.post('http://localhost:5260/assistantairouter/', {
                question: question,
                sessionId: this.sessionId
            }, config);

            if (!this.sessionId) {
                this.sessionId = response.data.sessionId;
            }

            this.lock = false;
            return response.data.answer;
        } catch (error) {
            console.error('Error:', error);
            return undefined;
        }
        //uhrzeit abchecken alternative
    }
}


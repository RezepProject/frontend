import axios, { AxiosRequestConfig, AxiosResponse } from '../../node_modules/axios/index';
import { TokenUtil } from './tokenUtil';

export class QuestionHandler {
    private static instance: QuestionHandler | null = null;
    private AIInUse: string = 'ChatGPT';
    private sessionId: string | null = null;
    private lock: boolean = false;
    private threadId: string | null = null;

    private constructor() {}

    public static getInstance(): QuestionHandler {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }

    public async getAnswerFromAi(question: string): Promise<string | undefined> {
        if (this.lock) return undefined;

        this.lock = true;

        try {
            const token = (await TokenUtil.getInstance()).getToken();
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            let response: AxiosResponse<any>;
            if (this.AIInUse === 'ChatGPT') {
                response = await axios.post(TokenUtil.route + '/assistantairouter', {
                    question,
                    sessionId: this.sessionId,
                }, config);

                if (!this.sessionId) {
                    this.sessionId = response.data.sessionId;
                }
            } else if (this.AIInUse === 'Mistral') {
                response = await axios.post(TokenUtil.route + '/assistantairouter/mistral', {
                    question,
                    threadId: this.threadId,
                }, config);

                if (!this.threadId) {
                    this.threadId = response.data.threadId;
                }
            } else {
                console.error('No AI in use');
                this.lock = false;
                return undefined;
            }

            return response.data.answer;
        } catch (error) {
            console.error('Error fetching AI answer:', error);
            return undefined;
        } finally {
            this.lock = false;
        }
    }
}

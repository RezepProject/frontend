import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

class QuestionHandler {
    private static instance: QuestionHandler | null = null;
    private sessionId: string | null = null;
    private timer: NodeJS.Timeout | null = null;

    public static getInstance(): QuestionHandler {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }

    public async getAnswerFromAi(question: string): Promise<string | undefined> {

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.sessionId = null;
        }, 60000);
        
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await TokenUtils.getInstance()).getToken()}`
            }
        };

        try {
            const response: AxiosResponse<any> = await axios.post('urlhere', {
                question: question,
                sessionId: this.sessionId
            }, config);

            if (!this.sessionId) {
                this.sessionId = response.data.sessionId;
            }

            return response.data.answer;
        } catch(error) {
            console.error('Error:', error);
            return undefined;
        }
        //uhrzeit abchecken alternative
    }
}

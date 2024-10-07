import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { TokenUtil } from '../util/TokenUtil'

export class QuestionHandler {
    private static instance: QuestionHandler | null = null
    AIInUse: string = 'ChatGPT'
    private sessionId: string | null = null
    private timer: NodeJS.Timeout | null = null
    private lock: boolean = false
    private threadId: string | null = null

    public static getInstance(): QuestionHandler {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler()
        }
        return QuestionHandler.instance
    }

    public async getAnswerFromAi(question: string): Promise<string | undefined> {

        if (this.lock) {
            return undefined
        }

        this.lock = true
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await TokenUtil.getInstance()).getToken()}`,
            },
        }
        console.log(this.AIInUse)
        if (this.AIInUse === 'ChatGPT') {
            try {
                const response: AxiosResponse<any> = await axios.post('http://localhost:5260/assistantairouter', {
                    question: question,
                    sessionId: this.sessionId,
                }, config)

                console.log(Date.now())
                console.log(response)

                if (!this.sessionId) {
                    this.sessionId = response.data.sessionId
                }

                this.lock = false
                return response.data.answer
            } catch (error) {
                console.error('Error:', error)
                return undefined
            }
            //uhrzeit abchecken alternative
        } else if (this.AIInUse === 'Mistral') {
            try {
                const response: AxiosResponse<any> = await axios.post('http://localhost:5260/assistantairouter/mistral', {
                    question: question,
                    threadId: this.threadId,
                }, config)

                console.log(Date.now())
                console.log(response)

                if (!this.threadId) {
                    this.threadId = response.data.threadId
                }

                this.lock = false
                return response.data.answer
            } catch (error) {
                console.error('Error:', error)
                return undefined
            }
        } else {
            console.error('No AI in use')
        }
    }
}
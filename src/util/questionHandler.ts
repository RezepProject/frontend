import axios, { AxiosRequestConfig, AxiosResponse } from '../../node_modules/axios/index';
import { TokenUtil } from './tokenUtil';
import {MenuManager} from "./menuManager";



export class QuestionHandler {
    private static instance: QuestionHandler | null = null;
    private AIInUse: string = 'ChatGPT';
    public sessionId: string | null = this.getSessionId();
    private lock: boolean = false;
    private threadId: string | null = null;

    private constructor() {}

    public static getInstance(): QuestionHandler {
        if (!QuestionHandler.instance) {
            QuestionHandler.instance = new QuestionHandler();
        }
        return QuestionHandler.instance;
    }

    private getSessionId(): string | null {
        let url = window.location.href;

        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        const parts = url.split('/');
        let id = parts[parts.length - 1];
        if (id === 'rezep-project-5chif.web.app') {
            id = null;
        }
        return id;
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

            let response: any;
            if (this.AIInUse === 'ChatGPT') {
                response = await axios.post(TokenUtil.route + '/assistantairouter', {
                    question,
                    sessionId: this.sessionId,
                    language: MenuManager.getInstance().getSettings().language,
                    userSession: null
                }, config);
                localStorage.setItem('sessionid', response.data.userSessionId);

                if (!this.sessionId) {
                    this.sessionId = response.data.sessionId;
                }
            } else if (this.AIInUse === 'Mistral') {
                response = await axios.post(TokenUtil.route + '/assistantairouter/mistral', {
                    question,
                    threadId: this.threadId,
                    language: MenuManager.getInstance().getSettings().language
                }, config);

                if (!this.threadId) {
                    this.threadId = response.data.threadId;
                }
            } else {
                console.error('No AI in use');
                this.lock = false;
                return undefined;
            }

            if(response.data.reservation){
                const credentials = await axios.get(TokenUtil.route + `/usersession/${response.data.userSessionId}`, config);

                window.localStorage.setItem('firstname', credentials.data.firstName);
                window.localStorage.setItem('lastname', credentials.data.lastName);
                window.localStorage.setItem('startdate', credentials.data.reservationStart);
                window.localStorage.setItem('enddate', credentials.data.reservationEnd);

                window.localStorage.setItem('sessionid', credentials.data.sessionId);
                window.localStorage.setItem('prossespers', credentials.data.processPersonalData);
                window.localStorage.setItem('threadId', credentials.data.chatGptThreadId);
                window.localStorage.setItem('resId', credentials.data.reservationId);

                window.localStorage.setItem('checkInRelaod', "true");
                location.reload();
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

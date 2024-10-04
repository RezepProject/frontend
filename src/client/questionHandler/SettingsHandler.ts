import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import { TokenUtil } from "../util/TokenUtil";

export class SettingsHandler {
    private static instance: SettingsHandler | null = null;
    private sessionId: string | null = null;
    private timer: NodeJS.Timeout | null = null;
    private lock: boolean = false;

    public static getInstance(): SettingsHandler {
        if (!SettingsHandler.instance) {
            SettingsHandler.instance = new SettingsHandler();
        }
        return SettingsHandler.instance;
    }

    public async getSettings(): Promise<any | undefined> {

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
            const response: AxiosResponse<any> = await axios.get('http://localhost:5260/settings', config);

            console.log(Date.now())
            console.log(response)

            if (!this.sessionId) {
                this.sessionId = response.data.sessionId;
            }

            this.lock = false;
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return undefined;
        }
        //uhrzeit abchecken alternative
    }
}
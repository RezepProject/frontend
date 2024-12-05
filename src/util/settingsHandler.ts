import axios, { AxiosRequestConfig, AxiosResponse } from "../../node_modules/axios/index";
import { TokenUtil } from "./tokenUtil";

export class SettingsHandler {
    private static instance: SettingsHandler | null = null;
    private sessionId: string | null = null;
    private lock = false;

    private constructor() {}

    public static getInstance(): SettingsHandler {
        if (!SettingsHandler.instance) {
            SettingsHandler.instance = new SettingsHandler();
        }
        return SettingsHandler.instance;
    }

    public async getSettings(): Promise<any | undefined> {
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

            const response: AxiosResponse<any> = await axios.get(TokenUtil.route + '/settings', config);

            if (!this.sessionId) {
                this.sessionId = response.data.sessionId;
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return undefined;
        } finally {
            this.lock = false;
        }
    }
}
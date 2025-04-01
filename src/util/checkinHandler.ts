import axios, { AxiosRequestConfig, AxiosResponse } from '../../node_modules/axios/index';
import { TokenUtil } from './tokenUtil';
import { MenuManager } from "./menuManager";

export class CheckInHandler {
    private static instance: CheckInHandler | null = null;
    private AIInUse: string = 'ChatGPT';
    private sessionId: string | null = null;
    private lock: boolean = false;
    private threadId: string | null = null;

    private constructor() { }

    public static getInstance(): CheckInHandler {
        if (!CheckInHandler.instance) {
            CheckInHandler.instance = new CheckInHandler();
        }
        return CheckInHandler.instance;
    }

    public async switchCheckIn() {
        await this.updateCredentials();

        console.log();
        

        if ((await this.getSessioinStatus()) === "InHouse") {
            await this.checkout();
        } else {
            await this.checkin();
        }
    }

    private async checkout() {
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
            response = await axios.post(TokenUtil.route + `/usersession/${localStorage.getItem('sessionid')}/reservation/checkout`, {}, config);

            console.log(response)
        } catch (error) {
            console.error('Error fetching AI answer:', error);
        } finally {
            this.lock = false;
        }
    }

    private async checkin() {
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
            response = await axios.post(TokenUtil.route + `/usersession/${localStorage.getItem('sessionid')}/reservation/checkin`, {}, config);
            console.log(localStorage.getItem('sessionid'))
            console.log(response)
        } catch (error) {
            console.error('Error fetching AI answer:', error);
        } finally {
            this.lock = false;
        }
    }

    private async getSessioinStatus(): Promise<string> {
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
            response = await axios.get(TokenUtil.route + `/usersession/${localStorage.getItem('sessionid')}/reservation`, config);
            return response.data.status;
        } catch (error) {
            console.error('Error fetching AI answer:', error);
            return undefined;
        } finally {
            this.lock = false;
        }
    }

    private async updateCredentials(): Promise<string | undefined> {
        let firstn = (document.getElementById("firstNameInput") as HTMLInputElement).value;
        let lastn = (document.getElementById("lastNameInput") as HTMLInputElement).value;
        let startd = (document.getElementById("startDateInput") as HTMLInputElement).value;
        let endd = (document.getElementById("endDateInput") as HTMLInputElement).value;

        this.lock = true;

        try {
            const token = (await TokenUtil.getInstance()).getToken();
            const config = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
            };

            console.log(startd)
            let data: putdata = {
                sessionId: localStorage.getItem('sessionid'), // Ensure this value is available in your component/class
                chatGptThreadId: localStorage.getItem('threadId') == "null" ? null : localStorage.getItem('threadId'), // Adjust according to your data source
                processPersonalData: true, // Default to true if not set
                firstName: firstn,
                lastName: lastn,
                reservationStart: startd,
                reservationEnd: endd,
                reservationId: null,
            };

            this.lock = false;
        } catch (error) {
            console.error('Error fetching AI answer:', error);
            console.log(error)
            return undefined;
        } finally {
            this.lock = false;
        }
    }
    private formatDate(input: string): string {
        const parts = input.split("-");
        if (parts.length !== 3) {
            throw new Error("Ungültiges Datum. Erwartetes Format: YYYY-MM-DD");
        }
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

}

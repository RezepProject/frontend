class TokenUtil {
    private static instance: TokenUtil | null = null;
    private token: string | null = null;

    private constructor() {
    }

    protected async setToken(): Promise<void> {
        const route = "http://localhost:5260";

        let resToken = await fetch(route + "/authentication", {
            method: "POST",
            body: JSON.stringify({
                "userIdentificator": "test",
                "password": "test"
            }),
            headers: {
                "Content-type": "application/json"
            }
        });

        this.token = await resToken.text();
    }

    public static async getInstance(): Promise<TokenUtil> {
        if (!TokenUtil.instance) {
            TokenUtil.instance = new TokenUtil();
            await TokenUtil.instance.setToken();
        }
        return TokenUtil.instance;
    }

    public getToken(): string | null {
        return this.token;
    }
}



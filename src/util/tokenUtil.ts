export class TokenUtil {
    private static instance: TokenUtil | null = null;
    private token: string | null = null;

    public static route = "https://if200113.cloud.htl-leonding.ac.at";

    private constructor() { }

    protected async setToken(): Promise<void> {

        let resToken = await fetch(TokenUtil.route + "/authentication", {
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

    public static async getInstance(reload: boolean = false): Promise<TokenUtil> {
        if (reload) {
            TokenUtil.instance = null;
        }
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
class TokenUtils {
    private static instance: TokenUtils | null = null;
    private token: string | null = null;

    private constructor() {
        
    }

    protected async setToken() : Promise<void> {
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
    public static async getInstance(): Promise<TokenUtils> {
        if (!TokenUtils.instance) {
            TokenUtils.instance = new TokenUtils();
            await TokenUtils.instance.setToken();
        }
        return TokenUtils.instance;
    }

    public getToken(): string | null {
        return this.token;
    }
}



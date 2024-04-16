export class CamaraUtil {
    private static instance: CamaraUtil | null = null;

    public static getInstance(): CamaraUtil {
        if (!CamaraUtil.instance) {
            CamaraUtil.instance = new CamaraUtil();
        }
        return CamaraUtil.instance;
    }

    private constructor() {
        // Singleton
    }
}
interface BackgroundImage{
    id: number,
    base64Image : string
}

interface Setting {
    id?: number;
    configUserId?: number;
    configUser?: number;
    name: string;
    backgroundImage: string;
    backgroundImageId: number;
    language: string;
    talkingSpeed: number;
    greetingMessage: string;
    state: boolean;
    aiInUse: string;
}
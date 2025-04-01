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

interface MenuIconType {
    lineWidth: number;
    lineHeight: number;
    lineSpacing: number;
    padding: number;
    startX: number;
    startY: number;
    size: number;
}

interface putdata {
    sessionId: string;
    chatGptThreadId: string;
    processPersonalData: boolean;
    firstName: string;
    lastName: string;
    reservationStart: string;
    reservationEnd: string;
    reservationId: string | null; // Explicitly allow null
}
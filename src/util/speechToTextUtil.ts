import {MenuManager} from "./menuManager";

export class SpeechToTextUtil {
    private recognition: SpeechRecognition | null = null;
    private language: string;

    constructor(language: string = MenuManager.getInstance().getSettings().language) {
        this.language = language;
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            console.error("Spracherkennung nicht verfügbar");
            return;
        }
        this.initRecognition();
    }

    private initRecognition() {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = this.language;
    }

    async start(): Promise<string> {
        if (!this.recognition) {
            console.error("Spracherkennung ist nicht initialisiert");
            return;
        }

        return new Promise((resolve, reject) => {
            let transcript = "";

            this.recognition!.onresult = (event: SpeechRecognitionEvent) => {
                const last = event.results[event.results.length - 1];
                if (last.isFinal) {
                    transcript += last[0].transcript.trim();
                    this.stop(); // Stop recognition once we have a result
                    resolve(transcript);
                }
            };

            this.recognition!.onerror = (event: SpeechRecognitionError) => {
                console.error("Fehler bei der Spracherkennung:", event);
                reject(new Error(`Speech Recognition Error: ${event.error}`));
            };

            this.recognition!.onend = () => {
                if (!transcript) {
                    console.log("Keine Sprachdaten erkannt");
                    return;
                }
            };

            this.recognition!.start();
        });
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
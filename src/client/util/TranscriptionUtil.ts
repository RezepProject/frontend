import { TokenUtil } from './TokenUtil'
import { QuestionHandler } from '../questionHandler/QuestionHandler'
import FaceUtil from './FaceUtil'
import { BehaviorSubject  } from 'rxjs';
import { chatMessages } from './chatUtil'

let hailmarry : BehaviorSubject <string> = new BehaviorSubject<string>("");
export { hailmarry };

export async function startSpeechRecognition(language: string ) {
    if (!("webkitSpeechRecognition" in window)) {
        throw new Error("Spracherkennung nicht verfügbar");
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language;

    let transcript = "";
    let lastSpeechRecognitionResult: SpeechRecognitionResult | null = null;
    let blocked = false;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const last = event.results[event.results.length - 1];
        const transcriptToAdd = last[0].transcript;


        //Send to server

        //TODO: Ändern von transcription to transcriptionToAdd

        if(!FaceUtil.getInstance().getIsSpeaking() && !blocked) {
            blocked = true;

            console.log("Transcript:", transcriptToAdd);
            chatMessages.push({ messageContent: transcriptToAdd, from: "sender"})
            chatMessages.push({ messageContent: "isTyping", from: "receiver"});
            transcript += transcriptToAdd;

            QuestionHandler.getInstance().getAnswerFromAi(transcriptToAdd).then((answer) => {
                console.log(answer);
                if (answer ) {
                    hailmarry.next(answer);
                    blocked = false;
                    //FaceUtil.getInstance().speak(answer);
                }
            });
            lastSpeechRecognitionResult = event.results[0];
        }
    };

    recognition.onspeechend = () => {
        if (!lastSpeechRecognitionResult) return;

        const finalTranscript = lastSpeechRecognitionResult[0].transcript;
        transcript = finalTranscript;
        lastSpeechRecognitionResult = null;
        recognition.stop();
        return transcript;
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Fehler bei der Spracherkennung:", event);
    };

    recognition.start();

    /*
    while (true) {
      await new Promise((resolve) => {
        recognition.onend = resolve;
      });

      if (!recognition.isListening) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }*/


    //recognition.stop();
    return transcript;
}

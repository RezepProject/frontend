import { CamaraUtil } from './util/CamaraUtil'
import { chatMessages } from './util/chatUtil'
import FaceUtil from "./util/FaceUtil";
import { QuestionHandler } from './questionHandler/QuestionHandler'
import { startSpeechRecognition } from './util/TranscriptionUtil'
import { hailmarry } from './util/TranscriptionUtil'

document.addEventListener("DOMContentLoaded", async () => {
    FaceUtil.getInstance();
    await CamaraUtil.getInstance().captureAndSendFrame()

    /*let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }*/
    chatMessages.push({ messageContent: "hello, how can i help you?", from: "receiver"})
    chatMessages.push({ messageContent: "isTyping", from: "sender"})

    hailmarry.subscribe(string => {
        if(string !== ""){
            FaceUtil.getInstance().speak(string);
        }
    })
    await startSpeechRecognition("de-DE");
})

document.onclick = () => {
    FaceUtil.getInstance().speak("hello");
}

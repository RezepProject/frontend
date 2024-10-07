import { CamaraUtil } from './util/CamaraUtil'
import { chatMessages } from './util/chatUtil'
import FaceUtil from "./util/FaceUtil";
import { QuestionHandler } from './questionHandler/QuestionHandler'
import { startSpeechRecognition } from './util/TranscriptionUtil'
import { SettingsHandler } from './questionHandler/SettingsHandler'

let settings : any | undefined;

document.addEventListener("DOMContentLoaded", async () => {
    
    FaceUtil.getInstance();
    await CamaraUtil.getInstance().captureAndSendFrame()

    /*let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }*/

    settings = (await SettingsHandler.getInstance().getSettings())

    if(settings != undefined){
        FaceUtil.getInstance().speakingLanguage = settings[0].language;
        FaceUtil.getInstance().talkingSpeed = Number(settings[0].talkingSpeed);
        await startSpeechRecognition(settings[0].language);
        console.log(settings[0])
    }
})

document.onclick = () => {
    FaceUtil.getInstance().speak(settings[0].greetingMessage + "", "receiver");
}


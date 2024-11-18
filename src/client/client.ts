import { CamaraUtil } from './util/CamaraUtil'
import FaceUtil from './util/FaceUtil'
import { QuestionHandler } from './questionHandler/QuestionHandler'
import { startSpeechRecognition } from './util/TranscriptionUtil'
import { SettingsHandler } from './questionHandler/SettingsHandler'

let settings : any | undefined;

document.addEventListener("DOMContentLoaded", async () => {
    let loadinghtml = <HTMLElement>document.getElementById("loading...");
    let startbuttonhtml = <HTMLElement>document.getElementById("startbutton");

    setTimeout(() => {
        loadinghtml.style.display = "none";
        startbuttonhtml.style.display = "block"
    }, 500);

    FaceUtil.getInstance();
    await CamaraUtil.getInstance().captureAndSendFrame()

    /*let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }*/

    settings = (await SettingsHandler.getInstance().getSettings())
    console.log(settings)
    if(settings != undefined){
        FaceUtil.getInstance().speakingLanguage = settings[0].language;
        console.log(settings[0].backgroundImage);
        let base64string = "data:image/jpg;base64," + settings[0].backgroundImage;
        FaceUtil.getInstance().setCustomBackground(base64string);
        FaceUtil.getInstance().talkingSpeed = Number(settings[0].talkingSpeed);
        QuestionHandler.getInstance().AIInUse = settings[0].aiInUse
        await startSpeechRecognition(settings[0].language);
        console.log(settings[0])
    }
})

document.onclick = () => {
    let startbuttonhtml = <HTMLElement>document.getElementById("startbutton");
    let actualassistant = <HTMLElement>document.getElementById("assistant");

    if(startbuttonhtml.style.display == "block"){
        actualassistant.style.display = "block";
        startbuttonhtml.style.display = "none";
        FaceUtil.getInstance().actuallyLoadTheFace();
        FaceUtil.getInstance().speak(settings[0].greetingMessage + "", "receiver");
    }
}
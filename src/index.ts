import {CanvasUtil} from "./util/canvasUtil";
import { QuestionHandler } from "./util/questionHandler";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";
import './style.css';
import {SettingsHandler} from "./util/settingsHandler";
import {ChatUtil} from "./util/chatUtil";

let can : CanvasUtil;
let theforgroundchat : HTMLElement;
let customGreetingMessage :string;
let chatUtils : ChatUtil;

document.addEventListener("DOMContentLoaded", async () => {
    can = new CanvasUtil(document.getElementById("thecan") as HTMLCanvasElement);
    theforgroundchat = document.getElementById("containerchatcontainer");
    can.getCanvas().width = window.innerWidth;
    can.getCanvas().height = window.innerHeight;
    can.drawText();

    let settings = (await SettingsHandler.getInstance().getSettings())
    if (settings != undefined) {
        customGreetingMessage = settings[0].greetingMessage;
        let base64string = "data:image/jpg;base64," + settings[0].backgroundImage;
        can.setBackgroundImg(base64string);
        //SETTINGS WE MIGHT NEED LATER:
        //FaceUtil.getInstance().speakingLanguage = settings[0].language;
        //console.log(settings[0].backgroundImage);
        //FaceUtil.getInstance().setCustomBackground(base64string);
        //FaceUtil.getInstance().talkingSpeed = Number(settings[0].talkingSpeed);
        //QuestionHandler.getInstance().AIInUse = settings[0].aiInUse
        //await startSpeechRecognition(settings[0].language);
        //console.log(settings[0])
    }
});

document.onclick = () => {
    can.drawACoolBackground();
    chatUtils = new ChatUtil(theforgroundchat);

    TextToSpeechUtil.getMp3Data(customGreetingMessage).then(async (data) => {
        can.renderBars(data);
        chatUtils.addMessage(customGreetingMessage);

        await new Promise((resolve) => setTimeout(resolve, 2000));
    });
}

export function audioFinished(){
    chatUtils.doneSpeaking();
    work();
}

function work() {
    const stt = new SpeechToTextUtil();
    stt.start().then(async (result) => {
        chatUtils.addMessage(result);
        let res = await QuestionHandler.getInstance().getAnswerFromAi(result);
        chatUtils.addMessage(res);

        TextToSpeechUtil.getMp3Data(res).then((data) => {
            can.renderBars(data);
        });
    });
}
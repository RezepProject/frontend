import {CanvasUtil} from "./util/canvasUtil";
import { QuestionHandler } from "./util/questionHandler";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";
import './style.css';
import {SettingsHandler} from "./util/settingsHandler";
import {ChatUtil} from "./util/chatUtil";
import {MenuManager} from "./util/menuManager";

let can : CanvasUtil;
let theforgroundchat : HTMLElement;
let customGreetingMessage :string;
let chatUtils : ChatUtil;

document.addEventListener("DOMContentLoaded", async () => {
    can = CanvasUtil.getInstance();
    //chatUtils = new ChatUtil(theforgroundchat);
    theforgroundchat = document.getElementById("containerchatcontainer");
    can.getCanvas().width = window.innerWidth;
    can.getCanvas().height = window.innerHeight;
    
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
    await setTimeout(() => {can.drawACoolBackground(); can.drawText(); can.drawMenuIcon();}, 150);

    MenuManager.getInstance();
});


let blockclick = false;
document.onclick = async () => {
    if(!blockclick){
        blockclick = true;
        if(can.stateOfApp == "home"){
            if(can.MouseOnClickMeButton()){
                drawtheforgroundchat();
            }else if(can.MouseOnMenuIcon()){
                can.drawMenu();
            }
            await setTimeout(() => {blockclick = false;}, 150);
            return
        }
        if(can.stateOfApp == "menu"){
            if(can.MouseOnMenuIcon()){
                MenuManager.getInstance().unloadMenu();
                can.drawHome();
            }
            await setTimeout(() => {blockclick = false;}, 150);
            return;
        }
        if(can.stateOfApp == "chat"){
            if(can.MouseOnMenuIcon()){
                location.reload();
            }
            await setTimeout(() => {blockclick = false;}, 150);
            return;
        }
        blockclick = false;
    }
}

function drawtheforgroundchat(){
    can.drawACoolBackground();
    chatUtils = new ChatUtil(theforgroundchat);
    chatUtils.buildChat();
    can.drawIconInMenu();

        TextToSpeechUtil.getMp3Data(customGreetingMessage)
        .then(async (data) => {
            can.drawACoolBackground();
            can.drawIconInMenu();
            can.renderBars(data);
            chatUtils.addMessage(customGreetingMessage);
        })
        .catch((e) => {
            console.error(e);
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
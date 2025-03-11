import {CanvasUtil} from "./util/canvasUtil";
import { QuestionHandler } from "./util/questionHandler";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";
import './style.css';
import {SettingsHandler} from "./util/settingsHandler";
import {ChatUtil} from "./util/chatUtil";
import {MenuManager} from "./util/menuManager";
import {CheckInHandler} from "./util/checkinHandler";
import {QrUtil} from "./util/qrCodeUtil";

let can : CanvasUtil;
let theforgroundchat : HTMLElement;
let chatUtils : ChatUtil;

function switchDateFormat(dateString : string) : string {
    const [year, month, day] = dateString.split("-");
    return `${year}.${day}.${month}`;
}

document.addEventListener("DOMContentLoaded", async () => {
    can = CanvasUtil.getInstance();
    //chatUtils = new ChatUtil(theforgroundchat);
    theforgroundchat = document.getElementById("containerchatcontainer");
    can.getCanvas().width = window.innerWidth;
    can.getCanvas().height = window.innerHeight;
    
    let settings : Setting = (await SettingsHandler.getInstance().getSettings())[0]
    if (settings != undefined) {
        MenuManager.getInstance().setSettings(settings);

        let base64string = "data:image/jpg;base64," + settings.backgroundImage;
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

    if(window.localStorage.getItem("qrCode") !== null && window.localStorage.getItem('qrCode').trim() !== "") {
        can.drawACoolBackground();
        QrUtil.showPopup(window.localStorage.getItem('qrCode'))
    }else if(window.localStorage.getItem('checkInRelaod') !== "true"){
        setTimeout(() => {can.drawACoolBackground(); can.drawText(); can.drawMenuIcon();}, 150);

        MenuManager.getInstance();
    }else{
        can.drawACoolBackground();
        const confirmContainer = document.getElementById("confirmCredentaials");

        if (!confirmContainer) return;

        // Retrieve stored values
        const firstName = localStorage.getItem("firstname") || "";
        const lastName = localStorage.getItem("lastname") || "";
        const startDate = switchDateFormat(localStorage.getItem("startdate")) || "";
        const endDate = switchDateFormat(localStorage.getItem("enddate")) || "";

        // Create the modal HTML
        confirmContainer.innerHTML = `
        <div id="overlay" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        ">
            <div style="
                position: relative;
                width: 400px;
                padding: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                font-family: Arial, sans-serif;
            ">
                <h2 style="text-align: center; color: #333;">Confirm Your Details</h2>
                
                <label style="font-weight: bold; display: block; margin-top: 10px;">First Name</label>
                <input id="firstNameInput" type="text" value="${firstName}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">

                <label style="font-weight: bold; display: block;">Last Name</label>
                <input id="lastNameInput" type="text" value="${lastName}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">

                <label style="font-weight: bold; display: block;">Start Date</label>
                <input id="startDateInput" type="date" value="${startDate}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px;">

                <label style="font-weight: bold; display: block;">End Date</label>
                <input id="endDateInput" type="date" value="${endDate}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 20px;">

                <div style="display: flex; justify-content: space-between;">
                    <button id="confirmBtn" style="background: #28a745; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; flex: 1; margin-right: 5px;">Confirm</button>
                    <button id="discardBtn" style="background: #dc3545; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; flex: 1; margin-left: 5px;">Discard</button>
                </div>
            </div>
        </div>
    `;

        // Add event listeners
        document.getElementById("confirmBtn")?.addEventListener("click", () => {
            CheckInHandler.getInstance().switchCheckIn();
            confirmContainer.innerHTML = "";
            window.localStorage.setItem('qrCode', window.location.href + "/" + window.localStorage.getItem("sessionid"))
            window.localStorage.removeItem("checkInRelaod");
            location.reload();
            /*can.drawACoolBackground();
            setTimeout(() => {can.drawACoolBackground(); can.drawText(); can.drawMenuIcon();}, 150);

            MenuManager.getInstance();*/
        });

        document.getElementById("discardBtn")?.addEventListener("click", () => {
            localStorage.removeItem("firstname");
            localStorage.removeItem("lastname");
            localStorage.removeItem("startdate");
            localStorage.removeItem("enddate");
            localStorage.removeItem("checkInRelaod");
            location.reload();
        });
    }
});

document.onclick = async () => {
    if(!MenuManager.getInstance().isLoading()){
        MenuManager.getInstance().setLoading(true);
        if(can.stateOfApp == "home"){
            if(can.MouseOnClickMeButton()){
                drawtheforgroundchat();
            }else if(can.MouseOnMenuIcon()){
                can.drawMenu();
            }
            MenuManager.getInstance().setLoading(false);
            return;
        }
        if(can.stateOfApp == "menu"){
            if(can.MouseOnMenuIcon()){
                MenuManager.getInstance().unloadMenu();
                can.drawHome();
            }

            MenuManager.getInstance().setLoading(false);
            return;
        }
        if(can.stateOfApp == "chat"){
            if(can.MouseOnMenuIcon()){
                window.localStorage.setItem('qrCode', window.location.href + "/" + QuestionHandler.getInstance().sessionId);
                location.reload();
            }
            MenuManager.getInstance().setLoading(false);
            return;
        }
    }
}

function drawtheforgroundchat(){
    can.drawACoolBackground();
    chatUtils = new ChatUtil(theforgroundchat);
    chatUtils.buildChat();
    can.drawIconInMenu();

        TextToSpeechUtil.getMp3Data(MenuManager.getInstance().getSettings().greetingMessage)
        .then(async (data) => {
            can.drawACoolBackground();
            can.drawIconInMenu();
            can.renderBars(data);
            chatUtils.addMessage(MenuManager.getInstance().getSettings().greetingMessage);
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
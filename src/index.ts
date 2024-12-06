import {CanvasUtil} from "./util/canvasUtil";
import { QuestionHandler } from "./util/questionHandler";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";
import './style.css';

document.addEventListener("DOMContentLoaded", () => {
    let can : CanvasUtil = new CanvasUtil(document.getElementById("backgroundCanvas") as HTMLCanvasElement);
    can.getCanvas().width = window.innerWidth;
    can.getCanvas().height = window.innerHeight;

    can.getCanvas().onclick = () => {
        TextToSpeechUtil.getMp3Data("hello, this is a test if the audio vizuliser audio vizulised").then(async (data) => {
            can.renderBars(data);

            await new Promise((resolve) => setTimeout(resolve, 2000));
        });
    }
    document.getElementById("chatContainer").onclick = can.getCanvas().onclick;
});

/*
document.addEventListener("DOMContentLoaded", () => {
    let container = document.getElementById("container") as HTMLElement;

    if (container) {
        container.style.gridTemplateColumns = `auto ${window.innerHeight}px auto`;
    }
})
const button = document.getElementById('startButton') as HTMLButtonElement;
//const canvas = document.getElementById("canvas") as HTMLCanvasElement;
button.addEventListener('click', start);

function start() {
    if (!canvas) {
        console.error("Failed to get canvas element.");
        return;
    }

    TextToSpeechUtil.getMp3Data("Hallo").then(async (data) => {
        CanvasUtil.renderBars(canvas, data);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        work();
    });
}

function work() {
    const stt = new SpeechToTextUtil();
    stt.start().then(async (result) => {
        let res = await QuestionHandler.getInstance().getAnswerFromAi(result);
        console.log(res);

        TextToSpeechUtil.getMp3Data(res).then((data) => {
            CanvasUtil.renderBars(canvas, data).then(work);
        });
    });
}*/
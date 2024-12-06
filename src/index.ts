import {CanvasUtil} from "./util/canvasUtil";
import { QuestionHandler } from "./util/questionHandler";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";

const button = document.getElementById('startButton') as HTMLButtonElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
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
}
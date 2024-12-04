import {CanvasUtil} from "./util/canvasUtil";
import {SpeechToTextUtil} from "./util/speechToTextUtil";
import {TextToSpeechUtil} from "./util/textToSpeechUtil";

const button = document.getElementById('startButton') as HTMLButtonElement;
button.addEventListener('click', start);

function start() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Failed to get canvas element.');
        return;
    }

    TextToSpeechUtil.getMp3Data("Hallo").then((data) => {
        CanvasUtil.renderBars(canvas, data);
    });

    let stt = new SpeechToTextUtil();
    stt.start().then((result) => {
        TextToSpeechUtil.getMp3Data(result).then((data) => {
            CanvasUtil.renderBars(canvas, data);
        });
    });
}
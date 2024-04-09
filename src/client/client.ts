import {initAudio} from "./util/AudioProcessorUtil";
import FaceUtil from "./util/FaceUtil";
import { startWebSocket } from './util/SpeechToTextUtil'
import { QuestionHandler } from './questionHandler/QuestionHandler'

document.addEventListener("DOMContentLoaded", async () => {
    // TODO: Comment in the following line to start the WebSocket server
    //await startWebSocket();
    await initAudio();
    FaceUtil.getInstance();

    let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }
})
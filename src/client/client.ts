import {initAudio} from "./util/AudioProcessorUtil";
import FaceUtil from "./util/FaceUtil";
import { startWebSocket } from './util/SpeechToTextUtil'

document.addEventListener("DOMContentLoaded", async () => {
    // TODO: Comment in the following line to start the WebSocket server
    await startWebSocket();
    await initAudio();
    FaceUtil.getInstance();
})
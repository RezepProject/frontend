import {initAudio} from "./util/AudioProcessorUtil";
import FaceUtil from "./util/FaceUtil";

document.addEventListener("DOMContentLoaded", async () => {
    await initAudio();
    new FaceUtil();
})
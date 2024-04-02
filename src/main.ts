import {initAudio} from "./util/AudioProcessorUtil.js";
import {initFace} from "./util/FaceUtil.js";

document.addEventListener("DOMContentLoaded", () => {
    initAudio();
    initFace();
})
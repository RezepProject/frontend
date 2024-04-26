import FaceUtil from "./util/FaceUtil";
import { QuestionHandler } from './questionHandler/QuestionHandler'
import { startSpeechRecognition } from './util/TranscriptionUtil'

document.addEventListener("DOMContentLoaded", async () => {
    FaceUtil.getInstance();
    await startSpeechRecognition("de-DE");
})
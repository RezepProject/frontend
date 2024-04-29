import FaceUtil from "./util/FaceUtil";
import { QuestionHandler } from './questionHandler/QuestionHandler'
import { startSpeechRecognition } from './util/TranscriptionUtil'
import { hailmarry } from './util/TranscriptionUtil'

document.addEventListener("DOMContentLoaded", async () => {
    FaceUtil.getInstance();
    hailmarry.subscribe(string => {
        if(string !== ""){
            FaceUtil.getInstance().speak(string);
        }
    })
    await startSpeechRecognition("de-DE");
})

document.onclick = () => {
}
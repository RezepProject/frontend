import FaceUtil from './util/FaceUtil'
import { CamaraUtil } from './util/CamaraUtil'

document.addEventListener("DOMContentLoaded", async () => {
    // TODO: Comment in the following line to start the WebSocket server
    //await startWebSocket();
    //await initAudio();
    FaceUtil.getInstance();
    await CamaraUtil.getInstance().captureAndSendFrame()

    /*let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }*/
})

document.onclick = () => {
    FaceUtil.getInstance().speak("hello");
}
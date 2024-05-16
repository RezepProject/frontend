import {initAudio} from "./util/AudioProcessorUtil";
import FaceUtil from "./util/FaceUtil";
import { startWebSocket } from './util/SpeechToTextUtil'
import { QuestionHandler } from './questionHandler/QuestionHandler'

import { HubConnectionBuilder } from '@microsoft/signalr';
import { TokenUtil } from './util/TokenUtil'

const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5260/hubs/connection", {
        accessTokenFactory: async () => (await TokenUtil.getInstance()).getToken() + ""
    })
    //.withAutomaticReconnect()
    .build();

connection.on("connected", (connectionId: string) => {
    console.log("Connected with ID:", connectionId);
});

connection.on("disconnected", (error: Error | undefined) => {
    if (error) {
        console.error("Disconnected:", error);
    } else {
        console.log("Disconnected");
    }
});

connection.start().then(() => {
    console.log("Connection established!");
}).catch(err => {
    console.error("Connection error:", err);
});

document.addEventListener("DOMContentLoaded", async () => {
    // TODO: Comment in the following line to start the WebSocket server
    //await startWebSocket();
    //await initAudio();
    FaceUtil.getInstance();

    let answer = await QuestionHandler.getInstance().getAnswerFromAi("test");
    if(answer) {
        FaceUtil.getInstance().speak(answer);
    }
})
import React, {useRef} from 'react';
import './App.css';
import {CompreFace, Detection} from "@exadel/compreface-js-sdk";

function App() {
    const videoTag = useRef<HTMLVideoElement>(null);
    const canvasElement1 = useRef<HTMLCanvasElement>(null);
    
    const handelStartVideo = () => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(res => {
                    videoTag.current!.srcObject = res;
            })
            .catch(err => console.log(err))

        if (videoTag.current) {
            videoTag.current.addEventListener('play', () => {
                let server: string = 'http://localhost';
                let port: number = 8000;
                let key: string = "622bcc61-978e-44e0-8dbb-2f8f6e724ef9";
                let core: CompreFace = new CompreFace(server, port);
                let detectionService: Detection = core.initFaceDetectionService(key);
                let context = canvasElement1.current!.getContext('2d');
                
                document.addEventListener('next_frame', () => {
                    context!.drawImage(videoTag.current as HTMLVideoElement, 0, 0, 640, 480);
                        canvasElement1.current!.toBlob(blob => {
                            if (blob) {
                                // TODO: Check if blob.toString() is correct
                                detectionService.detect(blob.toString())
                                    .then(res => console.log(res))
                                    .catch(err => console.log(err))
                            }
                        }, 'image/jpeg', 0.95);
                })

                const event = new Event('next_frame', {bubbles: true, cancelable: false});
                document.dispatchEvent(event);
            })
        }
    }
    return (
        <div className="App">
            <header className="App-header">
                <video ref={videoTag} width="640" height="480" autoPlay muted></video>
                <canvas ref={canvasElement1} style={{display: 'none'}} width="640" height="480"></canvas>
                <canvas style={{position: 'absolute'}} width="640" height="480"></canvas>

                <button onClick={handelStartVideo}>Start video</button>
            </header>
        </div>
    );
}

export default App;
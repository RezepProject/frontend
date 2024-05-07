import { TokenUtil } from './TokenUtil'
import FaceUtil from './FaceUtil'

export class CamaraUtil {
    private static instance: CamaraUtil | null = null

    public static getInstance(): CamaraUtil {
        if (!CamaraUtil.instance) {
            TokenUtil.getInstance()
            CamaraUtil.instance = new CamaraUtil()
        }
        return CamaraUtil.instance
    }

    private constructor() {
        // Singleton
    }

    public async captureAndSendFrame() {
        const route = 'http://localhost:5260/streaming'
        try {
            const video = document.createElement('video')
            video.width = 320
            video.height = 240

            video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })
            await video.play()

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            setInterval(async () => {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

                const base64Image = canvas.toDataURL('image/jpeg', 0.8)

                const frameObject = {
                    Data: base64Image.split(',')[1],
                }

                const response = await fetch(route, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (await TokenUtil.getInstance()).getToken(),
                    },
                    body: JSON.stringify(frameObject),
                })

                if (!response.ok) {
                    throw new Error(`Error sending frame: ${response.statusText}`)
                }

                const faces = await response.json()
                //console.log('Faces detected:', faces)
                if(faces.length >= 1){
                    FaceUtil.getInstance().lookAtMe(faces[0].x, faces[0].y);
                }
            }, 100); // Capture every 100ms
        } catch (error) {
            console.error('Error accessing webcam:', error)
        }
    }

}
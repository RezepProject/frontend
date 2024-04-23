import io from 'socket.io-client'

export class CamaraUtil {
    private static instance: CamaraUtil | null = null
    private wsConnection: WebSocket | null = null
    private myPeerConnection: RTCPeerConnection | null = null
    private webcamStream: MediaStream | null = null

    public static getInstance(): CamaraUtil {
        if (!CamaraUtil.instance) {
            CamaraUtil.instance = new CamaraUtil()
        }
        return CamaraUtil.instance
    }

    private constructor() {
        // Singleton
    }

    public async initCamara(): Promise<void> {
        try {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    const videoElement = document.createElement('video')
                    videoElement.srcObject = stream
                    videoElement.autoplay = true

                    document.body.appendChild(videoElement)

                    const socket = io('/')

                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')

                    videoElement.addEventListener('play', () => {
                        setInterval(() => {
                            canvas.width = videoElement.videoWidth
                            canvas.height = videoElement.videoHeight
                            context?.drawImage(videoElement, 0, 0)
                            const imageData = canvas.toDataURL('image/jpeg', 0.5) // Adjust quality as needed
                            socket.emit('sendFrame', imageData)
                        }, 100) // Send frame every 100 milliseconds (adjust for frame rate)
                    })

                })
                .catch(error => {
                    console.error('Error accessing camera:', error)
                })
        } catch (error) {
            console.error('MediaDevices.getUserMedia() error:', error)
        }
    }
}
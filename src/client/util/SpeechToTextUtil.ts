//fdf

/*
    . Installieren Sie die Pakete ws für WebSocket-Unterstützung und @google-cloud/speech für die Google Cloud Speech-to-Text API.
    . Installieren Sie Typdefinitionen für ws mit @types/ws, falls erforderlich. Beachten Sie, dass @google-cloud/speech bereits Typdefinitionen enthalten sollte.
    . Stellen Sie sicher, dass Sie eine gültige Google Cloud Platform (GCP) Servicekonto-Schlüsseldatei haben und den Pfad in Ihrem Code korrekt angeben.
*/
import { Server } from 'ws'
import { SpeechClient } from '@google-cloud/speech'

const speechToTextUtil: Server = new Server({ port: 3000 })
const client: SpeechClient = new SpeechClient({ keyFilename: './src/rezep-412016-44fe00ad3a67.json' })

export async function startWebSocket(): Promise<void> {
    speechToTextUtil.on('connection', (ws) => {
        ws.on('message', async (message: Buffer) => {
            try {
                const request = {
                    audio: { content: message.toString('base64') },
                    config: {
                        encoding: 'LINEAR16' as const,
                        sampleRateHertz: 44100,
                        languageCode: 'de-DE',
                    },
                }

                const [response] = await client.recognize(request)
                if (!response.results) return null
                const transcription: string = response.results
                    .map((result: any) => result.alternatives[0].transcript)
                    .join('\n')
                console.log(`Transcription: ${transcription} ...\n`)
            } catch (error) {
                console.error('Error:', error)
            }
        })
    })

    console.log('WebSocket-Server läuft auf Port 3000')
}

const WebSocket = require('ws');
const speech = require('@google-cloud/speech');

const server = new WebSocket.Server({ port: 3000 });
const client = new speech.SpeechClient({ keyFilename: './src/rezep-412016-44fe00ad3a67.json' });

server.on('connection', ws => {
    ws.on('message', async message => {
        try {
            
            const request = {
                audio: { content: message.toString('base64') },
                config: { encoding: 'LINEAR16', sampleRateHertz: 44100, languageCode: 'de-DE' },
            };
            
            const [response] = await client.recognize(request);
            console.log("Response: ", response);

            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
            console.log(`Transcription: ${transcription} ...\n`);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

console.log('WebSocket-Server läuft auf Port 3000');

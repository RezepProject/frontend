
//FDF
const socket: WebSocket = new WebSocket('ws://localhost:3000');

const BUFFER_SIZE: number = 16000 * 10; // Für 10 Sekunden Audio bei 16kHz
let audioBuffer: number[] = [];

async function initAudio(): Promise<void> {
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext: AudioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('audioProcessor.js');

        const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const processorNode: AudioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

        processorNode.port.onmessage = (event: MessageEvent) => {
            audioBuffer.push(...event.data);

            if (audioBuffer.length >= BUFFER_SIZE) {
                const wavData: Blob = convertToWavFormat(audioBuffer);
                socket.send(wavData);
                audioBuffer = []; // Reset the buffer
            }
        };
        source.connect(processorNode).connect(audioContext.destination);
    } catch (error) {
        console.error('MediaDevices.getUserMedia() error:', error);
    }
}

function convertToWavFormat(samples: number[]): Blob {
    const buffer: ArrayBuffer = new ArrayBuffer(44 + samples.length * 2);
    const view: DataView = new DataView(buffer);

    // Schreiben des WAV-Header
    writeString(view, 0, 'RIFF'); // ChunkID
    view.setUint32(4, 32 + samples.length * 2, true); // ChunkSize
    writeString(view, 8, 'WAVE'); // Format
    writeString(view, 12, 'fmt '); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat
    view.setUint16(22, 1, true); // NumChannels
    view.setUint32(24, 44100, true); // SampleRate
    view.setUint32(28, 44100 * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(view, 36, 'data'); // Subchunk2ID
    view.setUint32(40, samples.length * 2, true); // Subchunk2Size

    // Schreiben der Samples
    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(view: DataView, offset: number, input: number[]): void {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s: number = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

initAudio();

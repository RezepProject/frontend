//FDF
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent) => {
            // Handle the message
        };
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        const input: Float32Array[] = inputs[0];
        if (input && input.length > 0) {
            const inputChannelData: Float32Array = input[0];
            this.port.postMessage(inputChannelData);
        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);

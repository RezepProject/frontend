
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = event => {
        };
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const inputChannelData = input[0];
            this.port.postMessage(inputChannelData);
        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);

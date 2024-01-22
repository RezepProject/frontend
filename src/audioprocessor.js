
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = event => {
            // Verarbeiten eingehende Nachrichten vom Haupt-Thread, falls erforderlich
        };
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const inputChannelData = input[0];
            // Sendent Audiodaten zum Haupt-Thread
            //console.log(inputChannelData);
            this.port.postMessage(inputChannelData);
        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);

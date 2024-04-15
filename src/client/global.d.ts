// In einer Datei globals.d.ts oder einer anderen .d.ts-Datei in Ihrem Projekt
declare var AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

interface AudioWorkletProcessor {
    readonly port: MessagePort;
}

declare function registerProcessor(name: string, processorCtor: CustomAudioNodeConstructor): void;

interface CustomAudioNodeConstructor {
    new (...args: any[]): AudioWorkletProcessor;
}

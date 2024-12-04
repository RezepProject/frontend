export class CanvasUtil {
    public static initializeAudioContext(media: ArrayBuffer): { analyser: AnalyserNode, audio: HTMLAudioElement } {
        const audio = new Audio();
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();

        audio.src = URL.createObjectURL(new Blob([media]));
        audio.load();
        audio.play();

        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;

        return { analyser, audio };
    }

    public static configureCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Failed to get canvas 2D context.");
            return null;
        }
        return ctx;
    }

    public static renderBars(canvas: HTMLCanvasElement, media: ArrayBuffer) {
        const { analyser } = this.initializeAudioContext(media);
        const ctx = this.configureCanvas(canvas);

        if (!ctx) {
            return;
        }

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = (WIDTH / bufferLength) * 2.5;

        const drawBars = () => {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            let x = 0;

            analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        const renderFrame = () => {
            requestAnimationFrame(renderFrame);
            drawBars();
        };

        renderFrame();
    }
}

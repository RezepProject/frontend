export class CanvasUtil {
    constructor(canvas : HTMLCanvasElement) {
        this.can = canvas;
        this.ctx = this.configureCanvas(canvas);
    }

    private can : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;

    public getCtx() : CanvasRenderingContext2D{
        return this.ctx;
    }

    public getCanvas(): HTMLCanvasElement{
        return this.can;
    }

    private initializeAudioContext(media: ArrayBuffer): { analyser: AnalyserNode, audio: HTMLAudioElement } {
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

    private configureCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        if (!ctx) {
            console.error("Failed to get canvas 2D context.");
            return null;
        }
        return ctx;
    }

    public renderBars(media: ArrayBuffer): Promise<void> {
        let canvas = this.can;
        return new Promise((resolve) => {

            const { analyser, audio } = this.initializeAudioContext(media);

            const ctx = this.configureCanvas(canvas);
            if (!ctx) {
                resolve();
                return;
            }

            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;
            //const WIDTH = canvas.height;
            //const HEIGHT = canvas.width;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Calculate bar height to fill up to 90% of the canvas height
            const maxBarHeight = HEIGHT * 0.3;
            const barWidth = (WIDTH / bufferLength) * 2.5; // Adjust bar width based on canvas width

            const drawBars = () => {
                this.clearCanvas();

                let x = 0;

                analyser.getByteFrequencyData(dataArray);

                for (let i = 0; i < bufferLength; i++) {
                    // Calculate the bar height based on frequency data, scaled to maxBarHeight
                    const barHeight = (dataArray[i] / 255) * maxBarHeight;

                    const r = barHeight + (25 * (i / bufferLength)); // Dynamic red color
                    const g = 250 * (i / bufferLength); // Dynamic green color
                    const b = 50; // Fixed blue color

                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                    //ctx.fillRect(HEIGHT - barHeight, x, barHeight, barWidth);

                    x += barWidth + 1; // Increment x position for the next bar
                }
            };

            const renderFrame = () => {
                if (!audio.paused && !audio.ended) {
                    requestAnimationFrame(renderFrame);
                    drawBars();
                } else if (audio.ended) {
                    ctx.fillStyle = "#000";
                    resolve();
                }
                ctx.fillStyle = "#000";
            };

            renderFrame();
        });
    }

    private clearCanvas(){
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.can.width, this.can.height);
    }
}

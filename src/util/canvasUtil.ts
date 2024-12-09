import {ChatUtil} from "./chatUtil";
import {audioFinished} from "../index";

export class CanvasUtil {
    constructor(canvas : HTMLCanvasElement) {
        this.can = canvas;
        this.ctx = this.configureCanvas(canvas);
        this.backgroundImg = "";
    }

    private can : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private backgroundImg : string;

    public setBackgroundImg(newImg :string){
        this.backgroundImg = newImg;
        this.drawACoolBackground();
        this.drawText();
    }

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
                this.drawACoolBackground();

                let x = 0;

                analyser.getByteFrequencyData(dataArray);

                for (let i = 0; i < bufferLength; i++) {
                    // Calculate the bar height based on frequency data, scaled to maxBarHeight
                    const barHeight = (dataArray[i] / 255) * maxBarHeight;

                    const r = barHeight + (25 * (i / bufferLength)); // Dynamic red color
                    const g = 250 * (i / bufferLength); // Dynamic green color
                    const b = 50; // Fixed blue color

                    //ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillStyle = `rgb(${r/2}, ${g/2}, ${b})`;
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
                    resolve();
                    this.drawACoolBackground();
                    audioFinished()
                }
            };

            renderFrame();
        });
    }


    public drawACoolBackground(){
        if(this.backgroundImg != ""){
            let customimg = new Image();
            customimg.src = this.backgroundImg;

            this.ctx.drawImage(customimg, 0, 0, this.can.width, this.can.height);
            return;
        }
        const gradient = this.ctx.createLinearGradient(0, 0, this.can.width, this.can.height);
        gradient.addColorStop(0, "#0f2027");
        gradient.addColorStop(1, "#2c5364");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.can.width, this.can.height);
    }


    public drawText() {
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);

        // Background Gradient
        this.drawACoolBackground();

        // Title Text
        this.ctx.font = "bold 80px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = "rgba(0,0,0,0.7)";
        this.ctx.shadowBlur = 10;
        this.ctx.fillText("Lost?", this.can.width / 2, this.can.height / 2 - 60);

        // Button Background
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = "#ff6b6b";
        const btnWidth = 400, btnHeight = 100;
        const btnX = (this.can.width - btnWidth) / 2;
        const btnY = this.can.height / 2;

        this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
        this.ctx.shadowBlur = 0;

        // Button Text
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Click Me to Get Help", this.can.width / 2, btnY + 65);

        return { btnX, btnY, btnWidth, btnHeight };
    }
}

import {ChatUtil} from "./chatUtil";
import {audioFinished} from "../index";
import {TokenUtil} from "./tokenUtil";
import {MenuManager} from "./menuManager";

export class CanvasUtil {
    constructor(canvas : HTMLCanvasElement) {
        this.imagesDoneLoading = false;
        this.can = canvas;
        this.ctx = this.configureCanvas(canvas);
        this.backgroundImg = "";
        this.stateOfApp = "home";
        this.setMobile();
    }

    private static instance : CanvasUtil;
    public static getInstance(){
        if(!this.instance){
            this.instance = new CanvasUtil(document.getElementById("thecan") as HTMLCanvasElement);
        }
        return this.instance;
    }

    private imagesDoneLoading : boolean;
    private can : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private backgroundImg : string;
    private allBckgrndImgs : string[];

    private MousePosX : number;
    private MousePosY : number;

    public stateOfApp : string;

    private menuIcon : MenuIconType = {
        lineWidth: 30,  // Width of the lines
        lineHeight: 4,  // Height of the lines
        lineSpacing: 8, // Spacing between the lines
        padding: 20,    // Padding from the edge
        startX: 0,      // Start X position (will be calculated)
        startY: 0,       // Start Y position (will be calculated)
        size: 30,     // Size of the X
    };

    public setMobile(){
        for (const key in this.menuIcon) {
            if (typeof this.menuIcon[key as keyof MenuIconType] === 'number') {
                this.menuIcon[key as keyof MenuIconType] *= 2;
            }
        }
    }

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

        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            const mousePos = this.getMousePosition(event);
            this.MousePosX = mousePos.x;
            this.MousePosY = mousePos.y;
        });

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
                this.drawIconInMenu();

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
                    this.drawIconInMenu();
                    audioFinished()
                }
            };

            renderFrame();
        });
    }

    public drawMenuIcon() {
        this.menuIcon.startX = this.can.width - this.menuIcon.lineWidth - this.menuIcon.padding;
        this.menuIcon.startY = this.menuIcon.padding;

        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 3; i++) {
            const y = this.menuIcon.startY + i * (this.menuIcon.lineHeight + this.menuIcon.lineSpacing);
            this.ctx.fillRect(this.menuIcon.startX, y, this.menuIcon.lineWidth, this.menuIcon.lineHeight);
        }
    }

    public drawACoolBackground(){
        if(this.backgroundImg != ""){
            let customimg = new Image();
            customimg.src = this.backgroundImg;

            this.ctx.drawImage(customimg, 0, 0, this.can.width, this.can.height);
            return;
        }
    }


    public drawText() {
        // Background Gradient
        this.drawACoolBackground();

        // Title Text
        this.ctx.font = "bold 80px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = "rgba(0,0,0,0.7)";
        this.ctx.shadowBlur = 10;
        this.ctx.fillText((MenuManager.getInstance().getLan() == "en") ? "Lost?" : "Verloren?", this.can.width / 2, this.can.height / 2 - 60);

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
        this.ctx.fillText((MenuManager.getInstance().getLan() == "en") ? "Click me to get help" : "Klicke mich für Hilfe", this.can.width / 2, btnY + 65);

        return { btnX, btnY, btnWidth, btnHeight };
    }

    public MouseOnClickMeButton() : boolean {
        const btnWidth = 400, btnHeight = 100;
        const btnX = (this.can.width - btnWidth) / 2;
        const btnY = this.can.height / 2;

        if(this.MousePosX >= btnX && this.MousePosX <= btnX + btnWidth && this.MousePosY >= btnY && this.MousePosY <= btnY + btnHeight){
            this.stateOfApp = "chat";
            return true;
        }

        return false;
    }

    public MouseOnMenuIcon() : boolean {
        const iconWidth = this.menuIcon.lineWidth;
        const iconHeight = 3 * this.menuIcon.lineHeight + 2 * this.menuIcon.lineSpacing;
        let istru = (
            this.MousePosX >= this.menuIcon.startX &&
            this.MousePosX <= this.menuIcon.startX + iconWidth &&
            this.MousePosY >= this.menuIcon.startY &&
            this.MousePosY <= this.menuIcon.startY + iconHeight
        );
        if(istru){
            if(this.stateOfApp == "home"){
                this.stateOfApp = "menu";
            }else if(this.stateOfApp == "menu"){
                this.stateOfApp = "home";
            }else if(this.stateOfApp == "chat"){
                this.stateOfApp = "home";
            }
        }
        return istru;
    }

    private getMousePosition(event: MouseEvent): { x: number, y: number } {
        const rect = this.can.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }

    public drawMenu(){
        this.drawACoolBackground();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.can.width, this.can.height);
        this.drawIconInMenu();
        MenuManager.getInstance().loadMenu();
    }

    public drawHome(){
        this.drawText();
        this.drawMenuIcon();
    }

    public drawIconInMenu() {
        this.menuIcon.startX = this.can.width - this.menuIcon.size - this.menuIcon.padding;
        this.menuIcon.startY = this.menuIcon.padding;

        this.ctx.strokeStyle = "rgba(255,0,0,1)";
        this.ctx.lineWidth = this.menuIcon.lineWidth / 3;

        this.ctx.beginPath();
        // Draw the '/' part of the X
        this.ctx.moveTo(this.menuIcon.startX, this.menuIcon.startY);
        this.ctx.lineTo(this.menuIcon.startX + this.menuIcon.size, this.menuIcon.startY + this.menuIcon.size);
        this.ctx.stroke();

        this.ctx.beginPath();
        // Draw the '\' part of the X
        this.ctx.moveTo(this.menuIcon.startX + this.menuIcon.size, this.menuIcon.startY);
        this.ctx.lineTo(this.menuIcon.startX, this.menuIcon.startY + this.menuIcon.size);
        this.ctx.stroke();
    }
}

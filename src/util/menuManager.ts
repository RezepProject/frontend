import {TokenUtil} from "./tokenUtil";
import {CanvasUtil} from "./canvasUtil";
import {ChatUtil} from "./chatUtil";

export class MenuManager{
    private static instance : MenuManager;
    private menuDiv = document.getElementById("menutag");
    private allBckgrndImgs : BackgroundImage[];
    private imagesDoneLoading: boolean;
    private menuString = "";
    private currentLan : string;
    private settingsProvider: Setting;
    private currentlyLoading : boolean;
    private loadingstorage = "";

    constructor() {
        this.imagesDoneLoading = false;
        this.currentLan = "en";
        this.fetchBackgroundImage();
        this.setLoading(true);
        setTimeout(() => {
            this.setLoading(false);
        }, 1000)
    }

    public setLoading(val : boolean){
        if(val && !this.currentlyLoading){
            document.getElementById("playbody").style.display = "none";
        }else if(!val && this.currentlyLoading){
            document.getElementById("playbody").style.display = "contents";
        }
        this.currentlyLoading = val;
    }

    public isLoading(){
        return this.currentlyLoading;
    }

    public getSettings(){
        return this.settingsProvider;
    }

    public setSettings(setting : Setting){
        this.settingsProvider = setting;
        if(setting.language == "de"){
            this.currentLan = "de";
        }
    }

    public static getInstance() : MenuManager{
        if(!this.instance) {
            this.instance = new MenuManager();
        }
        return this.instance;
    }

    public getLan() : string {
        return this.currentLan;
    }

    public loadMenu(){
        this.buildMenuString();
        this.updateMenuDiv();
        document.getElementById("flags").onclick = () => {
            if(this.currentLan == "en"){
                this.currentLan = "de";
                this.settingsProvider.language = "de";
                this.settingsProvider.greetingMessage = "Herzlich willkommen beim Projekt-Award der HTL Leonding! Ich bin Herbert. Stellt mir gerne Fragen und entdeckt, was ich kann."
            }else{
                this.currentLan = "en";
                this.settingsProvider.language = "en-US";
                this.settingsProvider.greetingMessage = "Welcome to our hotel! How can I assist you?"
            }
            ChatUtil.sendSetting(this.settingsProvider);
            CanvasUtil.getInstance().drawMenu();
        }
        const thumbnails = document.querySelectorAll(".background-thumb");
        thumbnails.forEach((thumbnail : HTMLImageElement, index) => {
            thumbnail.onclick = () => {
                this.handleBackgroundClick(parseInt(thumbnail.id), thumbnail.src);
            };
        });
    }

    private async handleBackgroundClick(index : number, src : string){
        this.unloadMenu();
        CanvasUtil.getInstance().setBackgroundImg(src);
        CanvasUtil.getInstance().drawHome();
        this.settingsProvider.backgroundImageId = index;
        this.settingsProvider.backgroundImage = src.slice("data:image/png;base64,".length, src.length);
        await ChatUtil.sendSetting(this.settingsProvider);
        CanvasUtil.getInstance().stateOfApp = "home";
    }

    private buildMenuString() {
        let chosenflag = (this.currentLan == "en") ? `<img src="./img/Englishflag.png" alt="English" class="flag">` : `<img src="./img/GermanyFlag.jpg" alt="English" class="flag">`;
        let htmlsting = "";
        htmlsting += `<div class="menu">
      <!-- Language Selection Section -->
       <h1>${(this.currentLan == "en") ? "Menu" : "Menü"}</h1>
      <div class="language-selection">
        <h3>${(this.currentLan == "en") ? "Click to switch Language:" : "Klicke um die Spache zu ändern"}</h3>
        <div id="flags">
        ${chosenflag}
        </div>
      </div>
  
      <!-- Background Selection Section -->
      <div class="background-selection">
        <h3>${(this.currentLan == "en") ? "Select Background" : "Hintergrund wählen"}</h3>
        <div class="background-options">`;

        if(this.imagesDoneLoading){
            this.allBckgrndImgs.forEach(bi => {
                htmlsting += `         
         <div class="background-option">
            <img src="data:image/png;base64,${bi.base64Image}" id="${bi.id}" alt="Backgroundimg" class="background-thumb">
          </div>`;
            })
        }else{
            alert("not enough time to load images...")
        }


        htmlsting += `        </div>
      </div>
    </div>`
        ;

        this.menuString = htmlsting;
    }

    public unloadMenu(){
        this.menuString = "";
        this.updateMenuDiv();
    }

    private updateMenuDiv(){
        this.menuDiv.innerHTML = this.menuString;
    }

    private async fetchBackgroundImage() {
        try {
            // Get the TokenUtil instance and fetch the token
            const token = (await TokenUtil.getInstance()).getToken();

            if (!token) {
                throw new Error("Token could not be generated.");
            }

            // Define the endpoint URL
            const endpoint = `${TokenUtil.route}/backgroundimage`;

            // Make the API call with the token
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "accept": "text/plain",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.allBckgrndImgs = [];
            // Parse the response JSON
            const data : BackgroundImage[] = await response.json();
            for(let i = 0; i < data.length; i++){
                this.allBckgrndImgs.push({base64Image : data[i].base64Image, id : data[i].id});
            }
            this.imagesDoneLoading = true;
        } catch (error) {
            console.error("Error fetching background image:", error);
        }
    }
}
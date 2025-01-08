import {TokenUtil} from "./tokenUtil";
import {CanvasUtil} from "./canvasUtil";

export class MenuManager{
    private static instance : MenuManager;
    private menuDiv = document.getElementById("menutag");
    private allBckgrndImgs : string[];
    private imagesDoneLoading: boolean;
    private menuString = "";
    private currentLan : string;

    constructor() {
        this.imagesDoneLoading = false;
        this.currentLan = "en";
        this.fetchBackgroundImage();
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
            }else{
                this.currentLan = "en";
            }
            CanvasUtil.getInstance().drawMenu();
        }
        const thumbnails = document.querySelectorAll(".background-thumb");
        thumbnails.forEach((thumbnail : HTMLImageElement, index) => {
            thumbnail.onclick = () => {
                this.handleBackgroundClick(index, thumbnail.src);
            };
        });
    }

    private async handleBackgroundClick(index : number, src : string){
        this.unloadMenu();
        CanvasUtil.getInstance().setBackgroundImg(src);
        CanvasUtil.getInstance().drawHome();
        await setTimeout(() => {CanvasUtil.getInstance().stateOfApp = "home"}, 500)
    }

    private buildMenuString() {
        let chosenflag = (this.currentLan == "en") ? `<img src="./img/Englishflag.svg.png" alt="English" class="flag">` : `<img src="./img/GermanyFlag.jpg" alt="English" class="flag">`;
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
            <img src="data:image/png;base64,${bi}" alt="Backgroundimg" class="background-thumb">
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

            // Parse the response JSON
            const data = await response.json();
            this.allBckgrndImgs = [];
            for(let i = 0; i < data.length; i++){
                this.allBckgrndImgs.push(data[i].base64Image);
            }
            this.imagesDoneLoading = true;
        } catch (error) {
            console.error("Error fetching background image:", error);
        }
    }
}
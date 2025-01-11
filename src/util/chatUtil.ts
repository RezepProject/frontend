import {TokenUtil} from "./tokenUtil";

export class ChatUtil{
    private messages : string [];
    private containercontainer : HTMLElement;
    private chatContainer : HTMLElement;
    private isWaiting : boolean;

    constructor(theChatElement : HTMLElement) {
        this.containercontainer = theChatElement;
        this.isWaiting = false;
        this.messages = [];

        this.containercontainer.innerHTML = `
        <div id="chatContainer">
        </div>`;
        this.chatContainer = document.getElementById("chatContainer");
        this.buildChat();
    }

    public addMessage(mess : string){
        this.messages.push(mess);
        this.buildChat();
    }

    public doneSpeaking(){
        this.isWaiting = true;
        this.buildChat();
    }

    public buildChat(){
        let newchat = "";
        let from = true;

        this.messages.forEach(m => {
            newchat += `
            <div>
                <div class="message ${from ? 'receiver' : 'sender'}">
                    <div class="message-content">
                        <p>${m}</p>
                    </div>
                </div>
            </div>
            `;
            from = !from;
        })
        if(this.isWaiting || from){
            newchat += `
            <div>
                <div class="message ${from ? 'receiver' : 'sender'}">
                    <div class="typing-animation"></div>
                </div>
            </div>
        `;
        }

        this.chatContainer.innerHTML = newchat;
        this.isWaiting = false;
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    public unloadChat(){
        this.containercontainer.innerHTML = ``;
        this.chatContainer.innerHTML = "";
        this.isWaiting = false;
    }

    public static async sendSetting(setting: Setting) {
        const tokenUtil = await TokenUtil.getInstance();
        const token = tokenUtil.getToken();

        if (!token) {
            throw new Error('Token is not available');
        }

        const response = await fetch(`http://localhost:5260/settings/${setting.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': 'text/plain'
            },
            body: JSON.stringify(setting)
        });

        if (!response.ok) {
            throw new Error(`Failed to update setting: ${response.statusText}`);
        }

        // Prüfen, ob die Antwort einen Inhalt hat, bevor wir .json() aufrufen
        const text = await response.text();
        if (text) {
            return JSON.parse(text);
        }

        // Eventuell Rückgabe einer statusbezogenen Nachricht oder eines Objekts
        return { message: "Update successful", status: response.status };
    }
}
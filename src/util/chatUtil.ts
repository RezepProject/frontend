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
}
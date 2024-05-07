export interface chatMessage {
    messageContent : string | "isTyping",
    from : "sender" | "receiver"
}

class MessageArray {
    private items : chatMessage[];
    public maxMessages = 2;

    constructor() {
        this.items = [];
        this.push({ messageContent: "isTyping", from: "sender" });
    }

    push(item : chatMessage){
        this.items.push(item);
        let newItems = this.items;
        this.items = [];
        let incr: boolean = false;

        if(newItems.length >= 2 && newItems[newItems.length - 2].messageContent === "isTyping"){
            this.maxMessages += 1;
            incr = true;
        }

        for(let i = Math.max(0, newItems.length - this.maxMessages); i < newItems.length; i++) {
            if(item.messageContent === "isTyping" || newItems[i].messageContent !== "isTyping"){
                this.items.push(newItems[i]);
            }
        }

        if(incr){
            this.maxMessages -= 1;
        }

        this.updateMessages();
    }

    updateMessages(){
        let innerHTML = "";

        this.items.forEach(item => {
            if(item.messageContent === "isTyping"){
                innerHTML +=
                    `<div class="message ${item.from}">
                    <p class="typing-animation"></p>
                    </div>`;
            }else{
                innerHTML +=
                    `<div class="message ${item.from}">
                    <div class="message-content">
                        <p>${item.messageContent}</p>
                    </div>
                    </div>`;
            }
        });

        document.getElementById("chatbox")!.innerHTML = innerHTML;
    }
}

export let chatMessages = new MessageArray();
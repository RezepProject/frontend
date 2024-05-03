export interface chatMessage {
    messageContent : string | "isTyping",
    from : "sender" | "receiver"
}

class MessageArray {
    private items : chatMessage[] = [];
    public maxMessages = 2;

    push(item : chatMessage){
        this.items.push(item);
        let newItems = this.items;
        this.items = [];

        for(let i = Math.max(0, newItems.length - this.maxMessages); i < newItems.length; i++) {
            this.items.push(newItems[i]);
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
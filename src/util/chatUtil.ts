import {TokenUtil} from "./tokenUtil";

export class ChatUtil{
    private messages : string [];
    private containercontainer : HTMLElement;
    private chatContainer : HTMLElement;
    private isWaiting : boolean;
    private first : boolean;

    constructor(theChatElement : HTMLElement) {
        this.containercontainer = theChatElement;
        this.isWaiting = false;
        this.messages = [];
        this.first = true;
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
        this.first = false;
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
            if(!from || this.first) {
                newchat += `
                            <div>
                <div class="message ${from ? 'receiver' : 'sender'}">
 <div class="typing-animation"></div>
                </div>
            </div>
                `;
            }else{
            newchat += `
            <div>
                <div class="message ${from ? 'receiver' : 'sender'}">
                      <h4>Let's play a Game while I am thinking about your question!</h4>
  <div class="puzzle">
    <div id="tile1" class="tile" style="order:1"></div>
    <div id="tile2" class="tile" style="order:2"></div>
    <div id="tile3" class="tile" style="order:3"></div>
    <div id="tile4" class="tile" style="order:4"></div>
    <div id="tile5" class="tile" style="order:5"></div>
    <div id="tile6" class="tile" style="order:6"></div>
    <div id="tile7" class="tile" style="order:7"></div>
    <div id="tile8" class="tile" style="order:8"></div>
    <div id="tile9" class="tile" style="order:9"></div>
  </div>
  <div id="gameIsUpBox">
  
</div>

                </div>
            </div>
        `;}
        }

        this.chatContainer.innerHTML = newchat;

        if(from && !this.first){
            this.loadOnclickOnTiles();
        }
        this.isWaiting = false;
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    public unloadChat(){
        this.containercontainer.innerHTML = ``;
        this.chatContainer.innerHTML = "";
        this.isWaiting = false;
    }

    public loadOnclickOnTiles(){
        for(let i = 1; i <= 9; i++){
            console.log(document.getElementById(`tile${i}`))
            document.getElementById(`tile${i}`).onclick = () => {
                let me = document.getElementById(`tile${i}`);
                if(me.innerText == ""){
                    me.classList.add("dynamic-hovergreen");
                    me.innerText = "X";
                    let bo = this.generateBoard(true);
                    if(bo){
                        document.getElementById(`tile${this.getBestMove(bo)}`).innerText = "O";
                        document.getElementById(`tile${this.getBestMove(bo)}`).classList.add("dynamic-hoverred");
                    }
                    this.dialogIfOver();
                }
            }
        }
    }

    private dialogIfOver(){
        let winner = this.checkWinner(this.generateBoard(false));

        if(this.generateBoard(true) === null || winner !== null){
            for(let i = 1; i <= 9; i++) {
                document.getElementById(`tile${i}`).onclick = () => {}
            }
            let winnertext = "";

            if(winner === null){
                winnertext = "Looks like its a draw"
            }else{
                winnertext = "Well, maybe next time..."
            }

            document.getElementById("gameIsUpBox").innerHTML = `
<br>
<div class="containerforzhetext">
                <h3>${winnertext}</h3>
                <p>Dare to play again?</p>
                <button id="thepalyagainbutton">click me (:</button>
</div>
            `;

            document.getElementById("thepalyagainbutton").onclick = () => {
                this.buildChat();
            }
        }
    }

    private generateBoard(fullisnull : boolean): number[] {
        let board : number[] = []
        let nevercalled = true;
        for(let i = 1; i < 10; i++){
            if(document.getElementById(`tile${i}`).innerText == "X"){
                board.push(1)
            }else if (document.getElementById(`tile${i}`).innerText == "O"){
                board.push(-1)
            }else{
                nevercalled = false;
                board.push(0);
            }
        }
        if(nevercalled && fullisnull){
            return null;
        }

        return board;
    }

    private checkWinner = (b: number[]): number | null => {
        const winConditions = [
            [0,1,2], [3,4,5], [6,7,8], // Rows
            [0,3,6], [1,4,7], [2,5,8], // Columns
            [0,4,8], [2,4,6]           // Diagonals
        ];

        for (let condition of winConditions) {
            const [a, bIdx, c] = condition;
            if (b[a] !== 0 && b[a] === b[bIdx] && b[a] === b[c]) {
                return b[a];
            }
        }
        return null;
    };

    private getBestMove(board: number[]): number {
        // Function to check if there are moves left
        const isMovesLeft = (b: number[]): boolean => b.includes(0);

        // Minimax algorithm with depth consideration
        const minimax = (newBoard: number[], depth: number, isMax: boolean): number => {
            const score = this.checkWinner(newBoard);
            if (score !== null) {
                if (score === -1) { // "O" wins
                    return 10 - depth;
                } else if (score === 1) { // "X" wins
                    return depth - 10;
                }
            }

            if (!isMovesLeft(newBoard)) {
                return 0; // Draw
            }

            if (isMax) { // "O" is the maximizer
                let best = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (newBoard[i] === 0) {
                        newBoard[i] = -1; // "O" move
                        best = Math.max(best, minimax(newBoard, depth + 1, false));
                        newBoard[i] = 0; // Undo move
                    }
                }
                return best;
            } else { // "X" is the minimizer
                let best = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (newBoard[i] === 0) {
                        newBoard[i] = 1; // "X" move
                        best = Math.min(best, minimax(newBoard, depth + 1, true));
                        newBoard[i] = 0; // Undo move
                    }
                }
                return best;
            }
        };

        let bestVal = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = -1; // Try "O" move
                let moveVal = minimax(board, 0, false);
                board[i] = 0; // Undo move

                if (moveVal > bestVal) {
                    bestVal = moveVal;
                    bestMove = i;
                }
            }
        }

        // If no moves left (shouldn't happen as per game rules), return -1
        return bestMove !== -1 ? bestMove + 1 : -1;
    }



    public static async sendSetting(setting: Setting) {
        const tokenUtil = await TokenUtil.getInstance();
        const token = tokenUtil.getToken();

        if (!token) {
            throw new Error('Token is not available');
        }

        const response = await fetch(`https://if200113.cloud.htl-leonding.ac.at/settings/${setting.id}`, {
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
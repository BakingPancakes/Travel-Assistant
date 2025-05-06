import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";

export class ChatDisplayComponent extends BaseComponent {
    #container = null;

    constructor() {
        super();
        this.loadCSS('ChatDisplayComponent');
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContents();
        this.#attachEventListeners();
        return this.#container;
    }

    loadCSS(fileName) {
        if(this.cssLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Dynamically load CSS from the same directory as the JS file
        link.href = `/Frontend/src/components/MessagePageComponents/${fileName}/${fileName}.css`;
        document.head.appendChild(link);
        this.cssLoaded = true;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.id = 'chat-display-container';
    }

    #setupContainerContents() {
        this.#container.innerHTML = `
            <div id="messages-header">
                <h1>[Chat name]</h1>
            </div>
            <div id="messages-display">
                Chats go here
            </div>
            <input id="input-box" type="text" placeholder="Type message here...">
        `;
        // comment out below if not using mock data
        // this.#container.getElementById("messages-display").innerHTML += `
        //     <div class="chat-bubble chat-from">[Jasper] Hey Zavier! How's the messages page going?</div>
        //     <div class="chat-bubble chat-to">It's going swell! [Zavier]</div>
        // `;

    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();
        // hub.subscribe(Events.OpenChat, chatData => this.#displayChat(chatData));

        const input_box = this.#container.querySelector("#input-box");
        input_box.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && event.target.value !== ""){
                const newMessage = document.createElement("div");
                newMessage.classList.add("chat-bubble");
                newMessage.classList.add("chat-to");
                newMessage.textContent = event.target.value + " [Zavier]";
            
                const display = document.getElementById("messages-display");
                display.appendChild(newMessage);
                input_box.value = "";
            }
});

        // TODO
        // sending new message
        // retrieving new message
    }

    #displayChat(chatData) {
        const messagesDisplay = document.getElementById('messages-display');
        messagesDisplay.innerHTML = '';
        chatData.messages.forEach(message => {
            const newMessageBubble = document.createElement('div');
            newMessageBubble.classList.add('chat-bubble');
            message.sender == 'to'  ?
                newMessageBubble.classList.add('chat-to') :
                newMessageBubble.classList.add('chat-from');
            newMessageBubble.innerHTML = message.text;
            newMessageBubble.innerHTML += `<span>${chatData.date}: ${chatData.name}</span>`
            messagesDisplay.appendChild(newMessageBubble);
        })
    }
}
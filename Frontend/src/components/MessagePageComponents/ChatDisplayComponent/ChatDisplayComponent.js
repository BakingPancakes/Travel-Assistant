import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../lib/eventhub/events.js";

export class ChatDisplayComponent extends BaseComponent {
    #container = null;

    constructor() {
        super();
        // this.loadCSS('ChatDisplayComponent');
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

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('chat-display-container');
    }

    #setupContainerContents() {
        this.#container.innerHTML = `
            <div id="messages-header">
                <h1>[Chat name]</h1>
            </div>
            <div id="messages-display">
            </div>
            <input id="input-box" type="text" placeholder="Type message here...">
        `;
        // comment out below if not using mock data
        // document.getElementById("messages-display").innerHTML += `
        //     <div class="chat-bubble chat-from">[Jasper] Hey Zavier! How's the messages page going?</div>
        //     <div class="chat-bubble chat-to">It's going swell! [Zavier]</div>
        // `;
        document.getElementById("messages-display").innerHTML = "Chats go here.";

    }

    #attachEventListeners() {
        const hub = EventHub.instance();
        hub.subscribe(Events.OpenChat, chatData => this.#displayChat(chatData));

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
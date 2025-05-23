import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";
import { Message } from "../../../lib/models/Message.js"

export class ChatDisplayComponent extends BaseComponent {
    #container = null;
    #hub = EventHub.getInstance();
    #currentChat = null;

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
                <h1 id="header-content"></h1>
            </div>
            <div id="messages-display">
                <div id="default-display-message"> Click on a chat to the left to begin connecting... </div>
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
        this.#hub.subscribe(Events.OpenChat, (chatData) => this.#displayChat(chatData));

        const input_box = this.#container.querySelector("#input-box");
        input_box.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && event.target.value !== "" && !this.#container.querySelector('#default-display-message')){
                const date = new Date();
                const newMessage = new Message({
                    sender: 'to',
                    text: event.target.value,
                    name: 'Me',
                    timestamp: date.toDateString(),
                });
                this.#displayMessage(newMessage);
                this.#storeMessageLocal(newMessage, this.#currentChat)
                input_box.value = "";
            }
        });

        // TODO:
        // sending new message
        // retrieving new message
    }

    #displayMessage(message) {
        const newMessageBubble = document.createElement("div");
        newMessageBubble.classList.add("chat-bubble");
        newMessageBubble.classList.add("chat-to");
        newMessageBubble.innerHTML = message.text;
        newMessageBubble.innerHTML += `<br><span>${message.timestamp}: ${message.name}</span>`
    
        const display = document.getElementById("messages-display");
        display.appendChild(newMessageBubble);
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
            newMessageBubble.innerHTML += `<br><span>${message.timestamp}: ${message.name}</span>`
            messagesDisplay.appendChild(newMessageBubble);
        })
        const header = document.getElementById('header-content');
        this.#currentChat = chatData.id;
        header.innerHTML = chatData.name;
    }

    #storeMessageLocal(newMessage, chat_id) {
        const chatDataList = JSON.parse(localStorage.getItem("chatDataList"));
        console.log(chatDataList);
        chatDataList.find(chatData => chatData.id === chat_id).messages.push(newMessage);
        localStorage.setItem("chatDataList", JSON.stringify(chatDataList));
    }
}
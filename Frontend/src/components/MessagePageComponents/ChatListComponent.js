import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../lib/eventhub/eventHub.js";
import { Events } from "../../lib/eventhub/events.js";

export class ChatListComponent extends BaseComponent {
    #container = null;
    #profileChatPermissions = []; // ID of all chats that user has access to
    #localChats = [{
        id: {
            id: 99999999,
            name: 'name text',
            trip: 'trip name',
            members: ['JoonID', 'JasperID'],
            messages: [{
                    sender: 'from',
                    timestamp: '1:00PM, April 25',
                    text: 'Heyooo',
                    name: 'Jasper',
                },
                {
                    sender: 'to',
                    timestamp: '1:02PM, April 25',
                    text: 'Hey!',
                    name: 'Joon',
                }
            ]
        }
    }]; // objects with "chat id: chat data" key-value pairs
    #userData;

    constructor() {
        super();
        // this.loadCSS('ChatListComponent');
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement("div");
        this.#container.id = 'chat-groups-container';
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
        <h1>Chats</h1>
        <input id="add-chat-button" type="button" value="+">
        `;
        // comment out next 2 lines if not using mock data:
        this.#container.innerHTML += `<input class="chat-icon" type="button" value="👤 Jasper">
        <input class="chat-icon" type="button" value="👤 Joon">`;     

        const createChatPopupForm = this.document.createElement("form");
        createChatPopupForm.classList.add("form-container");
        createChatPopupForm.innerHTML = `
            <label for"username"><b>Who would you like to chat with?</b></label>
            <input type="text" placeholder="Enter Friend's ID..." required name="profile_id">

            <br>
            <label for="name"><b>Chat Name<b/></label>
            <input type="text" placeholder="Enter Chat Name..." required name="chat_name">

            <br>
            <label for="trip">Enter a trip ID if you would like to enable in-message trip edit funcitonality.</label>
            <input type="text" placeholder="Enter Trip ID..." name="trip_id">

            <br>
            <input type="button" id="btn-create" value="Create Chat">
            <input type="button" id="btn-cancel" value="Cancel">
        `;

        createChatPopupForm.style.display = "none";
        this.#container.appendChild(createChatPopupForm);

        // TODO
        // this.#profileChatPermissions.forEach(id => this.#retreiveChatsFromServer(id));
        // grab chats from server
        // add them to local chats
        // display each of them to icon display bar
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();

        // New Chat created
        // hub.subscribe('CreateNewChat', (chatInfo) => this.#CreateNewChat(chatInfo));

        // Display Popup Form
        const createChatPopupForm = this.document.getElementsByClassName("form-container")[0];
        const addChatButton = this.document.getElementById("add-chat-button");
        addChatButton.addEventListener("click", () => {
            createChatPopupForm.style.display = "block";
        });

        // Hide Popup Form
        const cancelChatCreationButton = this.document.getElementById('btn-cancel');
        cancelChatCreationButton.addEventListener('click', () => {
            createChatPopupForm.style.display = "none";
        });

        // Open Chats when icon clicked
        Array.from(document.getElementsByClassName("chat-icon")).forEach(element => {
            element.addEventListener('click', () => this.#openChatWindow(element.id));
        });
        
        // Process chat creation
        const createChatButton = this.document.getElementById('btn-create');
        createChatButton.addEventListener("click", () => {
            const profileID = document.forms["form-container"].profile_id.value;
            const chatName = document.forms["form-container"].chat_name.value;
            const tripName = document.forms["form-container"].trip_id.value;

            if (!(profileID && chatName)) {
                alert("Please enter a Profile ID and Chat name if you would like to create a chat.");
                return;
            }

            
            //local:
            this.#clearForm(createChatPopupForm);

            const newChat = {
                id: Math.floor(Math.random() * 1001),
                name: chatName,
                // members: [this.#userData.id, profileID]
                trip: tripName,
                messages: {to: [], from: []},
            }

            this.#localChats.push(newChat);
            this.#displayTab(newChat);

            // eventhub:
            //! update local and send to server, 
            //!   or send to server and grab new profile every time need to re-load messages?
            this.#addChatIDToUserPermissions(newChat.id); // update user profile in server
            this.#storeNewChat(newChat); // add to both local storage & server
            this.#inviteAssociatedUser(newChat.id); // TBD
            this.#openChatWindow(newChat.id); // contact other component to display this chat
        });
    }

    #clearForm(popupForm) {
        popupForm.profile_id.value = '';
        popupForm.chat_name.value = '';
        popupForm.trip_id.value = '';
        popupForm.style.display = 'none';
    }

    #displayTab(chat) {
        const chatName = chat.name;
        if (chatName != undefined) {
            const newChatIcon = document.createElement("input");
            newChatIcon.classList.add("chat-icon");
            newChatIcon.type = "button";
            newChatIcon.value = chatName;
            newChatIcon.id = chat.id;
            newChatIcon.addEventListener('click', () => this.#openChatWindow(chat.id));
            this.#container.appendChild(newChatIcon);
        }
        else{
            alert(`There was a problem displaying a chat icon with name, ID: ${chat.name}, ${chat.id}`);
        }

    }

    #addChatIDToUserPermissions(id) {

    }

    #storeNewChat(newChat) {

    }

    #inviteAssociatedUser(id) {

    }

    #openChatWindow(id) {
        const hub = EventHub.instance();
        const newChat = this.#localChats.find(chat => chat.id === id);

        hub.publish(Events.OpenChat, newChat);
    }

    #retreiveChatsFromServer() {
        //TODO
    }
}
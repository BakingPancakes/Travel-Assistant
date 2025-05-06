import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";
import { Chat } from "../../../lib/models/Chat.js";
import { User } from "../../../lib/models/user.js";

export class ChatListComponent extends BaseComponent {
    #container = null;
    #localChats = [];
    #userData = null;
    #hub = EventHub.getInstance();

    constructor() {
        super();
        this.loadCSS('ChatListComponent');
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

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        console.log(this.#container.outerHTML);
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement("div");
        this.#container.id = 'chat-groups-container';
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
        <h1>Chats<input id="add-chat-button" type="button" value="+"></h1>
        `;
        
        // comment out next 2 lines if not using mock data:
        this.#container.innerHTML += `<input class="chat-icon" type="button" value="👤 Jasper">
        <input class="chat-icon" type="button" value="👤 Joon">`;     

        const createChatPopupForm = document.createElement("form");
        createChatPopupForm.classList.add("form-container");
        createChatPopupForm.innerHTML = `
            <label for"profile_id"><b>Who would you like to chat with?</b></label>
            <input type="text" placeholder="Enter Friend's ID..." required name="profile_id">

            <br>
            <label for="chat_name"><b>Chat Name<b/></label>
            <input type="text" placeholder="Enter Chat Name..." required name="chat_name">

            <br>
            <label for="trip_id"><b>Enter a trip ID if you would like to enable in-message trip edit funcitonality.<b/></label>
            <input type="text" placeholder="Enter Trip ID..." name="trip_id">

            <br>
            <input type="button" id="btn-create" value="Create Chat">
            <input type="button" id="btn-cancel" value="Cancel">
        `;
        createChatPopupForm.style.display = "none";
        this.#container.appendChild(createChatPopupForm);

        // Grab user data & display associated tabs
        const TEMP_USER_ID = 1 // TODO grab local storage OR authentication.
        this.#userData = this.#retreiveUserData(TEMP_USER_ID);

        // this.#localChats = this.#retreiveChatsFromServer(this.#userData.chat_perms);
        this.#localChats.forEach(chat => this.#displayTab(chat));
    }

    #attachEventListeners() {
        // Display Popup Form
        const createChatPopupForm = this.#container.getElementsByClassName("form-container")[0];
        const addChatButton = this.#container.querySelector("#add-chat-button");
        addChatButton.addEventListener("click", () => {
            createChatPopupForm.style.display = "block";
        });
        
        // Hide Popup Form
        const cancelChatCreationButton = this.#container.querySelector('#btn-cancel');
        cancelChatCreationButton.addEventListener('click', () => {
            createChatPopupForm.style.display = "none";
            this.#clearForm(createChatPopupForm);
        });

        // Open Chats when any icon is clicked
        Array.from(this.#container.getElementsByClassName("chat-icon")).forEach(element => {
            element.addEventListener('click', () => this.#openChatWindow(element.id));
        });
        
        // Process chat creation
        const createChatButton = this.#container.querySelector('#btn-create');
        createChatButton.addEventListener("click", () => this.#handleChatCreation());

        // accept invite to new chat
        this.#hub.subscribe(Events.AcceptChatInvitation, chat => this.#acceptChatInvite(chat.id));
    }
    
    /**
     * 
     * @param {number} id ID of chat to be displayed
     */
    #openChatWindow(id) {
        const newChat = this.#localChats.find(chat => chat.id === id);
        this.#hub.publish(Events.OpenChat, newChat);
    }

    #handleChatCreation() {
        const profileID = document.forms["form-container"].profile_id.value;
        const chatName = document.forms["form-container"].chat_name.value;
        const tripName = document.forms["form-container"].trip_id.value;

        if (!(profileID && chatName)) {
            alert("Please enter a Profile ID and Chat name if you would like to create a chat.");
            return;
        }
        
        const createChatPopupForm = this.#container.getElementsByClassName("form-container")[0];
        this.#clearForm(createChatPopupForm);

        const date = new Date();

        const newChat = new Chat({
            name: chatName,
            members: [this.#userData.id, profileID],
            trip: tripName,
            messages: [],
            date: `${date.getMonth()} ${date.getDate()}, ${date.getHours()}`,
        })

        // TODO: don't display tab, add perms, and send invite if there is an error storing new chat
        this.#localChats.push(newChat);
        this.#displayTab(newChat);

        // eventhub:
        //! update local and send to server, 
        //!   or send to server and grab new profile every time need to re-load messages?
        this.#storeNewChat(newChat); // add to both local storxage & server
        this.#addChatIDToUserPermissions(newChat.id); // update user profile in server
        this.#inviteAssociatedUser(newChat.id); // TBD
        this.#openChatWindow(newChat.id); // contact other component to display this chat
    }
    
    #clearForm(popupForm) {
        popupForm.profile_id.value = '';
        popupForm.chat_name.value = '';
        popupForm.trip_id.value = '';
        popupForm.style.display = 'none';
    }

    /**
     * 
     * @param {Chat} chat Tab is displayed in chat list
     */
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

    /**
     * @param {Array<number>} chat_ids Valid user object
     * @return {Array<Chat>} Array of chat objects that user has permissions to. Empty if user has no permissions.
     */
    #retreiveChatsFromServer(chat_ids) {
        this.#hub.publish(Events.RetrieveChatData, {chat_ids: chat_ids});
    }
    
    /**
     * 
     * @param {number} id User's ID as stored in session.
     * @return {User} User's data in User object.
     */
    #retreiveUserData(id) {
        this.#hub.publish(Events.RetrieveUserData, {id: id});
    }

    /**
     * 
     * @param {number} id ID to add to current user's permissions.
     */
    #addChatIDToUserPermissions(id) {
        this.#userData.chat_perms.push(id);
        this.#hub.publish(Events.AddChatIDToUserPermissions, {user_id: this.#userData.id, id: id});
    }

    /**
     * 
     * @param {Chat} newChat Chat to add to database of chats.
     */
    #storeNewChat(newChat) {
        this.#hub.publish(Events.StoreNewChatGroup, newChat);
    }

    #inviteAssociatedUser(id) {
        console.log(`User with id ${id} magically invited to chat. (Haven't implemented this yet.)`)
    }

    #acceptChatInvite(id) {
        alert("Incoming chat invite. Automatically accepted.")
        this.#addChatIDToUserPermissions(id);
        const newchat = this.#retreiveChatsFromServer([id]);
        this.#displayTab(newchat);
    }
}
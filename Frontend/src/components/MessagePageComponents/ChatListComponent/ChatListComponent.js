import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";
import { Chat } from "../../../lib/models/Chat.js";
import { User } from "../../../lib/models/user.js";

export class ChatListComponent extends BaseComponent {
    #container = null;
    #chatDataList = [];
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

        this.#container = document.createElement("div");
        this.#container.id = 'chat-groups-container';

        this.#setupContainerContent();
        this.#attachEventListeners();

        // Grab user data & display associated tabs
        const TEMP_USER_ID = 1
        this.#retreiveUserData(TEMP_USER_ID);

        return this.#container;
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
        <h1>Chats<input id="add-chat-button" type="button" value="+" style="display: none;"></h1>
        <span id="loading-message">Loading Chat and user data...</span>
        `;
        
        // comment out next 2 lines if not using mock data:
        // this.#container.innerHTML += `<input class="chat-icon" type="button" value="👤 Jasper">
        // <input class="chat-icon" type="button" value="👤 Joon">`;     

        const createChatPopupForm = document.createElement("form");
        createChatPopupForm.classList.add("form-container");
        createChatPopupForm.innerHTML = `
            <label><b>Who would you like to chat with?</b></label>
            <br>
            <input type="text" placeholder="Enter Friend's ID..." required name="profile_id">

            <br>
            <label><b>Chat Name<b/></label>
            <br>
            <input type="text" placeholder="Enter Chat Name..." required name="chat_name">

            <br>
            <label ><b>Enter a trip ID if you would like to enable in-message trip edit funcitonality.<b/></label>
            <br>
            <input type="text" placeholder="Enter Trip ID..." name="trip_id">

            <br>
            <input type="button" id="btn-create" value="Create Chat">
            <input type="button" id="btn-cancel" value="Cancel">
        `;
        createChatPopupForm.style.display = "none";
        this.#container.appendChild(createChatPopupForm);
    }

    #attachEventListeners() {
        /** async server for data retrieval  **/
        // Retrieving user's data for particular userID
        this.#hub.subscribe(Events.RequestUserDataSuccess, (userData) => {
            this.#setUserDataLocal(userData);
            this.#loadExistingChats();
            this.#container.querySelector('#add-chat-button').style.display = "block";
            this.#container.querySelector('#loading-message').style.display = "none";

        });
        this.#hub.subscribe(Events.RequestUserDataFailure, () => {
            alert("Error: couldn't retrieve user data from the server. Please refresh the page or contact an admin.");
        });
        // Retrieving chats from server for particular user
        this.#hub.subscribe(Events.RequestChatDataSuccess, (chatDataList) => {
            chatDataList.forEach(chatData => this.#setChatDataLocal(chatData));
            chatDataList.forEach(chatData => this.#displayTab(chatData));
        });
        this.#hub.subscribe(Events.RequestChatDataFailure, () => {
            alert("Error: couldn't retrieve user's chat data from the server. Please refresh the page or contact an admin.");
        });
        // Storing new chats to server
        this.#hub.subscribe(Events.StoreNewChatGroupSuccess, () => {
            console.log("Successfully added new chat group to server.");
        });
        this.#hub.subscribe(Events.StoreNewChatGroupFailure, () => {
            alert("Error: couldn't save new chat to server.");
        });
        // Storing new Chat ID to user
        this.#hub.subscribe(Events.AddChatIDToUserPermissionsSuccess, (id) => {
            this.#addChatIDToUserPermissions(id);
        });
        this.#hub.subscribe(Events.AddChatIDToUserPermissionsFailure, () => {
            alert("Error: unable to add chat ID to the user's permissions on server.");
        });

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
        
        // Process chat creation - publishes newChat, once stored successfully, then make local changes
        const createChatButton = this.#container.querySelector('#btn-create');
        createChatButton.addEventListener("click", () => this.#handleChatCreationStart());
        this.#hub.subscribe(Events.StoreNewChatGroupSuccess, (chatData) => {
            this.#setChatDataLocal(chatData);
            this.#displayTab(chatData);
            // TODO erorr handling for the following
            this.#hub.publish(Events.AddChatIDToUserPermissions, {user_id: this.#userData.id, id: chatData.id});
            // this.#inviteAssociatedUser(chatData.id); // TBD
            this.#openChatWindow(chatData.id);
        });
        this.#hub.subscribe(Events.StoreNewChatGroupFailure, () => {
            alert("Error: couldn't create chat and store to server!");
        });

        // accept invite to new chat
        this.#hub.subscribe(Events.AcceptChatInvitation, chat => this.#acceptChatInvite(chat.id));
    }

    #handleChatCreationStart() {
        // Grab info from popup form
        const profileID = this.#container.querySelector('.form-container').profile_id.value;
        const chatName = this.#container.querySelector('.form-container').chat_name.value;
        const tripName = this.#container.querySelector('.form-container').trip_id.value;

        if (!(profileID && chatName)) {
            alert("Please enter a Profile ID and Chat name if you would like to create a chat.");
            return;
        }

        const chatCreationForm = this.#container.getElementsByClassName("form-container")[0];
        this.#clearForm(chatCreationForm);

        // Create Chat object and store in server + local
        const date = new Date();

        const newChat = new Chat({
            name: chatName,
            members: [this.#userData.id, profileID],
            trip: tripName,
            messages: [],
            date: `${date.getMonth()} ${date.getDate()}, ${date.getHours()}`,
        })

        //TODO server implementation
        this.#hub.publish(Events.StoreNewChatGroup, newChat); // must be in this scope bc form acceptance logic could forego publishing even if return
        return newChat;
    }
        
    /**
     * @param {number} id ID of chat to be displayed
     */
    #openChatWindow(id) {
        const chatData = this.#chatDataList.find(chat => chat.id === id);
        this.#hub.publish(Events.OpenChat, chatData);
    }

    /**
     * @param {Chat} chat Tab is displayed in chat list
     * For chat-icon
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
        
    #loadExistingChats() {
        // clear chatDataList before grabbing from storage
        this.#chatDataList = [];
        if (!localStorage.getItem("chatDataList")) {
            this.#retrieveChatData(this.#userData.chat_perms);
            // chats are displayed in retreivechatdatasuccess subscription
        } else {
            this.#chatDataList = JSON.parse(localStorage.getItem("chatDataList"));
            this.#chatDataList.forEach(chatData => this.#displayTab(chatData));
        }
    }
    
    /**
     * @param {Array<number>} chat_ids Array of chat IDs that user has permission to
     * When first loading the page, contacts server if chat data isn't already 
     */
    #retrieveChatData(chat_ids) {
        if (!localStorage.getItem("chatDataList")) {
            this.#hub.publish(Events.RequestChatData, {chat_ids: chat_ids});
        } else {
            const chatDataList = JSON.parse(localStorage.getItem("chatDataList"));
            this.#chatDataList = chatDataList;
        }
    }
        
    /**
     * 
     * @param {number} id User's ID as stored in session.
     * @return {User} User's data in User object.
     * When first loading the page, 
     *    or retrieving data from users associated with a chat
     */
    #retreiveUserData(id) {
        if (!localStorage.getItem("userData")) {
            this.#hub.publish(Events.RequestUserData, {id: id});
            // subscribed to Events.ReceiveUserDataSuccess, which runs setUserDataLocal
        } else {
            const userData = JSON.parse(localStorage.getItem("userData"));
            if (!userData) {
                alert("Error while retreiving user's data in local storage.");
            }
            console.log("Grabbed user's data from localStorage.")
            this.#hub.publish(Events.RequestUserDataSuccess, userData)
        }
    }

    /**
     * @param { Chat } chatData Chat to add to database of chats.
     * Adds chat to environment chatDataList and localStorage's chatDataList
     */
    #setChatDataLocal(chatData) {
        // only adds to local if not already in local
        if (!this.#chatDataList.find((chat) => chat.id == chatData.id)) {
            this.#chatDataList.push(chatData);
            let chatDataList = JSON.parse(localStorage.getItem("chatDataList"));
            if (!chatDataList) {
                chatDataList = Array();
            }
            chatDataList.push(chatData);
            localStorage.setItem('chatDataList', JSON.stringify(chatDataList));
        }
    }

    /**
     * 
     * @param { User } userData 
     * Sets environment user data, and stores in localStorage
     */
    #setUserDataLocal(userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
        this.#userData = userData;
    }

    /**
     * @param {number} id ID to add to current user's permissions.
     * Updates local chat perms for user in environment and localstorage
     */
    #addChatIDToUserPermissions(id) {
        this.#userData.chat_perms.push(id);
        localStorage.setItem('userData', JSON.stringify(this.#userData));
    }

    /**
     * @param { number } id user's associated id, should be in profile page
     * Optional function, not implemented yet
     */
    #inviteAssociatedUser(id) {
        //TODO service implementation
        console.log(`User with id ${id} magically invited to chat. (Haven't implemented this yet.)`);
    }

    /**
     * 
     * @param { number } id ID of new chat to add to user's account
     * Accepts chat invite automatically, but alerts user
     */
    #acceptChatInvite(id) {
        alert("Incoming chat invite. Automatically accepted.");
        this.#addChatIDToUserPermissions(id);
        const newchat = this.#retrieveChatData([id]);
        this.#displayTab(newchat);
    }
        
    /**
     * 
     * @param { HTMLDivElement } popupForm The popform to clear
     * For form-container
     */
    #clearForm(popupForm) {
        popupForm.profile_id.value = '';
        popupForm.chat_name.value = '';
        popupForm.trip_id.value = '';
        popupForm.style.display = 'none';
    }
}
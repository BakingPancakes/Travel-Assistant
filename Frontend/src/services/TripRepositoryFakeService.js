import Service from "./Service.js";
import { fetch } from "../utility/fetch.js";
import { Events } from "../lib/eventhub/events.js"

export class TripRepositoryRemoteFakeService extends Service {
    constructor() {
        super();
    }

    async storeTrip(tripData) {
        const response = await fetch("http://localhost:3000/trip", {
            method: "POST",
            body: JSON.stringify(tripData),
        });
        const data = await response.json();
        return data;
    }

    async clearTrips() {
        const response = await fetch("http://localhost:3000/trip", {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    }

    async retrieveChats(chat_ids) {
        const response = await fetch(`http://localhost:3000/chats`, {
            chat_ids: chat_ids
        });
        if (!response.ok) {
            this.publish(Events.RetrieveChatDataFailure);
        }
        const data = await response.json();

        this.publish(Events.RetrieveChatDataSuccess, data.chatDataList);
    }

    async storeChatGroup(chatData) {
        const response = await fetch("/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatData),
        });

        if (!response.ok) {
            this.publish(Events.StoreNewChatGroupFailure);
        }

        const data = await response.json();
        this.publish(Events.StoreNewChatGroupSuccess, data);
    }

    async retrieveUser(id) {
        const response = await fetch(`http://localhost:3000/user`, {
            user_id: id,
        });
        if (!response.ok) {
            this.publish(Events.RequestUserDataFailure);
        }
        const userData = await response.json();

        this.publish(Events.RequestUserDataSuccess, userData);
    }

    addSubscriptions() {
        this.subscribe(Events.StoreTrip, (data) => {
            this.storeTrip(data);
        });
        this.subscribe(Events.UnStoreTrips, () => {
            this.clearTrips();
        });
        
        this.subscribe(Events.RequestChatData, (chat_ids) => {
            this.retrieveChats(chat_ids);
        });
        this.subscribe(Events.StoreNewChatGroup, (chatData) => {
            this.storeChatGroup(chatData);
        })
        this.subscribe(Events.RequestUserData, (id) => {
            this.retrieveUser(id.id);
        });
        // this.subscribe(Events.AddChatIDToUserPermissions, (user_and_chat_IDs) => {
        //     this.storeIDGroupWithUser(user_and_chat_IDs);
        // })
    }
}
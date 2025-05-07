import Service from "./Service.js";
import { Events } from "../lib/eventhub/events.js";
import Base64 from "../utility/base64.js";

export class TripRepositoryRemoteService extends Service {
    constructor() {
        super();
        const TEMP_USER_ID = 1; // TODO: pass this into constructor from main.
        // this.#initUser(TEMP_USER_ID);
        // this.#initChats(TEMP_USER_ID);
        this.#initTrips();
    }

    addSubscriptions() {
        this.subscribe(Events.StoreTrip, (data) => {
            this.storeTrip(data);
        });

        this.subscribe(Events.UnstoreTrips, () => {
            this.clearTrips();
        });
        /**
         * TODO:
         * - RequestChatData
         * - RequestUserData
         * - StoreNewChatGroup
         * - AddChatIdToUserPermissions
         * 
         */
        this.subscribe(Events.RequestChatData, (chat_ids) => {
            this.retrieveChats(chat_ids);
        });
        this.subscribe(Events.RequestUserData, (id) => {
            this.retrieveUser(id);
        });
        this.subscribe(Events.StoreNewChatGroup, (chatData) => {
            this.storeChatGroup(chatData);
        })
        this.subscribe(Events.AddChatIDToUserPermissions, (user_and_chat_IDs) => {
            this.storeIDGroupWithUser(user_and_chat_IDs);
        })
    }

    /**
     * Trip services:
     */
    async #initTrips() {
        const response = await fetch("/trips");
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();

        data.tasks.forEach(async (trip) => {
            // Convert base64 string back to blob
            if (trip.file) {
                trip.file = Base64.convertBase64ToFile(
                    trip.file,
                    trip.mime,
                    trip.filename
                );
            }
            // Publish the task.
            this.publish(Events.NewTrip, trip);
        });
    }

    async storeTrip(tripData) {
        await this.#toBase64(tripData);

        const response = await fetch("/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData),
        });

        if (!response.ok) {
            throw new Error("Failed to store task");
        }

        const data = await response.json();
        return data;
    }

    async clearTrips() {
        const response = await fetch("/trips", {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to clear tasks");
        }

        // Notify subscribers that trips are cleared from the server
        this.publish(Events.UnStoreTripsSuccess);

        return data;
    }

    /**
     * Chat services:
     */
    async #initChats(id) {
        const response = await fetch(`/chats:id${id}`);
        if (!response.ok) {
            this.publish(Events.RetrieveChatDataFailure);
        }
        const data = await response.json();

        if (data.chatData.file) {
            chatData.file = Base64.convertBase64ToFile(
                chatData.file,
                chatData.mime,
                chatData.filename
            );
        }

        this.publish(Events.RetrieveChatDataSuccess, chatData);
    }

    async retrieveChats(chats_ids) {
        const response = await fetch(`/chats/${chats_ids}`);
        if (!response.ok) {
            this.publish(Events.RetrieveChatDataFailure);
        }
        const data = await response.json();

        if (data.chatData.file) {
            chatData.file = Base64.convertBase64ToFile(
                chatData.file,
                chatData.mime,
                chatData.filename
            );
        }

        this.publish(Events.RetrieveChatDataSuccess, chatData);
    }

    async storeChatGroup(chatData) {
        await this.#toBase64(chatData);

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

    async #initUser(id) { // where will this be implemented?
        const response = await fetch(`/user/${id}`);
        if (!response.ok) {
            this.publish(Events.RequestUserDataFailure);
        }
        const data = await response.json();

        if (data.userData.file) {
            userData.file = Base64.convertBase64ToFile(
                userData.file,
                userData.mime,
                userData.filename
            );
        }

        this.publish(Events.RequestUserDataSuccess, userData);
    }

    async retrieveUser(id) {
        const response = await fetch(`/user/${id}`);
        if (!response.ok) {
            this.publish(Events.RequestUserDataFailure);
        }
        const data = await response.json();

        if (data.userData.file) {
            userData.file = Base64.convertBase64ToFile(
                userData.file,
                userData.mime,
                userData.filename
            );
        }

        this.publish(Events.RequestUserDataSuccess, userData);
    }

    async storeIDGroupWithUser(user_and_chat_IDs) {
        await this.#toBase64(user_and_chat_IDs);

        const response = await fetch(`/user/${user_and_chat_IDs.user_id}`, {
            method: "UPDATE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({chat_id: user_and_chat_IDs.id}),
        });

        if (!response.ok) {
            this.publish(Events.StoreNewChatGroupFailure);
        }

        const data = await response.json();
        this.publish(Events.StoreNewChatGroupSuccess, data);
    }

    async #toBase64(tripData) {
        if (tripData.file) {
            // Need to store the mime type separately as it is needed when
            // converting back to blob when fetched from the server.
            tripData.mime = tripData.file.type;
            // Store the filename separately as well
            tripData.filename = tripData.file.name;
            // Convert the file to base64
            const base64 = await Base64.convertFileToBase64(tripData.file);
            tripData.file = base64;
          }
    }
}


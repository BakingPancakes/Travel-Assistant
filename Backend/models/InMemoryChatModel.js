import { Chat } from "../../Frontend/src/lib/models/Chat";

class _InMemoryChatModel {

    constructor() {
        this.chats = [];
    }

    async create(chat) {
        this.chats.push(chat);
        return chat;
    }

    async read(id = null) {
        if (id) {
            return this.chats.find(chat => chat.id === id);
        }

        return this.chats;
    }

    async update() {
        //TODO
    }
}
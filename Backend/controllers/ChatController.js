import ModelFactory from "../models/ModelFactory";

class ChatController {
    constructor() {
        ModelFactory.getModel().then(model => {
            this.model = model;
        });
    }

    async getAllChats(req, res) {
        const chats = await this.model.read();

        res.json({ chats });
    }

    async getChatByID(req, res) {
        const chat = await this.model.read(req.body);

        res.json({ chat });
    }

    async createChat(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Chat improperly sent for creation."});
            }

            const chat = await this.model.create(req.body);
            
            return res.status(201).json(chat);
        } catch(error) {
            console.error(`Error adding chat: ${error}`);
            return res.status(500).json({ error: 'Failed to add chat'});
        }
    }
}

export default new ChatController();
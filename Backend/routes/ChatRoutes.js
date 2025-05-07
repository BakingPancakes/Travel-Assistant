import express from "express";
import {
    getAllChats,
    getChatByID,
    createChat,
} from "../controllers/ChatController.js"


class ChatRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // GET chat data by id
        router.get('/chats:id', async (req, res) => {
            await getChatByID(req, res)
        });
        
        // GET all chat data
        router.get('/chats', getAllChats);
        
        // POST a new chat
        router.post('/chat', createChat);
    }

    getRouter() {
        return this.router;
    }
 }

export default new ChatRoutes().getRouter();
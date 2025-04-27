import express from "express";
import {
    getAllChats,
    getChatByID,
    createChat
} from "../controllers/ChatController.js"

const router = express.Router();

// GET chat data by id
router.get('/:id', getChatByID);

// GET all chat data
router.get('/', getAllChats);

// POST a new chat
router.post('/', createChat);

export default router;
import express from "express";
import { sendMessage, getMessagesInChat, deleteMessage } from "../controllers/MessageController";

const router = express.Router();

// Send a new message
router.post("/", sendMessage);

// Get all messages in a chat
router.get("/:chatId", getMessagesInChat);

// Delete a message
router.delete("/:id", deleteMessage);

export default router;
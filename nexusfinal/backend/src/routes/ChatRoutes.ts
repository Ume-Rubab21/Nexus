import express from "express";
import { startChat, getChatsForStudent, deleteChat } from "../controllers/ChatController";

const router = express.Router();

// Create or get existing chat between friends
router.post("/start", startChat);

// Get all chats for a student
router.get("/:studentId", getChatsForStudent);

// Delete a chat
router.delete("/:chatId", deleteChat);

export default router;
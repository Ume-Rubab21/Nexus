import { Request, Response } from "express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { Student } from "../models/studentModel";
import { simpleDecrypt } from "../utils/SimpleEncryption";

// ✉️ Send a message (REST - not used by socket)
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, sender, receiver, text } = req.body;

    if (!chatId || !sender || !receiver || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const message = new Message({ chatId, sender, receiver, text });
    await message.save();

    res.status(201).json({ message: "Message sent 💌", data: message });
  } catch (err) {
    res.status(500).json({ message: "Error sending message", err });
  }
};

// 📜 Get all messages in a chat (HISTORY LOADER)
export const getMessagesInChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    // 🔥 DECRYPT HERE — this is the missing part
  const decryptedMessages = messages.map((m) => ({
    _id: m._id,
    sender: m.sender,
    receiver: m.receiver,
    text: simpleDecrypt(m.text), // decrypt stored text
    timestamp: m.timestamp,
  }));

    res.status(200).json(decryptedMessages);
  } catch (err) {
    console.error("getMessagesInChat error:", err);
    res.status(500).json({ message: "Error fetching messages", err });
  }
};

// 🗑️ Delete message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message", err });
  }
};

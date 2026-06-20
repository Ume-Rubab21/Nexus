import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Student } from "../models/studentModel";

// 🎯 Start or open a chat between two friends
export const startChat = async (req: Request, res: Response) => {
  try {
    const { studentId, friendId } = req.body;

    if (!studentId || !friendId) {
      return res.status(400).json({ message: "Both student IDs are required" });
    }

    // Verify both users are registered
    const student = await Student.findById(studentId);
    const friend = await Student.findById(friendId);
    if (!student || !friend) {
      return res.status(404).json({ message: "Both users must be registered students" });
    }

    // Check if a chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [studentId, friendId], $size: 2 },
    });

    if (!chat) {
      chat = new Chat({ participants: [studentId, friendId] });
      await chat.save();
      return res.status(201).json({ message: "New chat created ✅", chat });
    }

    // Chat already exists
    res.status(200).json({ message: "Chat already exists ✅", chat });
  } catch (err) {
    res.status(500).json({ message: "Error creating chat", err });
  }
};

// 💬 Get all chats for a logged-in student
export const getChatsForStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const chats = await Chat.find({ participants: studentId }).populate("participants", "name email");
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats", err });
  }
};

// 🗑️ Delete a chat
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({ chatId });
    res.status(200).json({ message: "Chat and related messages deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting chat", err });
  }
};
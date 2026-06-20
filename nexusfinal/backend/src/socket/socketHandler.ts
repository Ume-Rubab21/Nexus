// other imports...
import { simpleEncrypt, simpleDecrypt } from "../utils/SimpleEncryption";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { Student } from "../models/studentModel";

interface OnlineUser {
  userId: string;
  email: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

// -------------------------
// VERIFY SOCKET TOKEN
// -------------------------
const verifySocketToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// -------------------------
// MAIN HANDLER
// -------------------------
export const socketHandler = (io: Server) => {
  // Authenticate each socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authentication required"));

    const userId = verifySocketToken(token);
    if (!userId) return next(new Error("Invalid or expired token"));

    (socket as any).userId = userId;
    next();
  });

  // -------------------------
  // ON CONNECTION
  // -------------------------
  io.on("connection", async (socket: Socket) => {
    const userId = (socket as any).userId;
    const user = await Student.findById(userId);
    const userEmail = user?.email || "unknown";

    console.log("⚡ User connected:", userEmail);

    // -------------------------
    // USER JOINS
    // -------------------------
    socket.on("join", () => {
      // remove any previous socket of same user
      onlineUsers = onlineUsers.filter((u) => u.userId !== userId);

      // register fresh socket
      onlineUsers.push({
        userId,
        email: userEmail,
        socketId: socket.id,
      });

      console.log("Online Users:", onlineUsers.map((u) => u.email));
      io.emit("onlineUsers", onlineUsers.map((u) => u.email));
    });

    // -------------------------
    // SEND MESSAGE
    // -------------------------
    socket.on("sendMessage", async ({ receiverEmail, text }) => {
      console.log(`📨 Message from ${userEmail} → ${receiverEmail}:`, text);

      if (!text?.trim()) {
        socket.emit("error", "Message cannot be empty");
        return;
      }

      try {
        // Find receiver
        const receiver = await Student.findOne({ email: receiverEmail });
        if (!receiver) {
          socket.emit("error", "Receiver not found");
          return;
        }

        const receiverId = String(receiver._id);

        // Find chat OR create new
        let chat = await Chat.findOne({
          participants: { $all: [userId, receiverId] },
        });

        if (!chat) {
          chat = await Chat.create({
            participants: [userId, receiverId],
          });
        }

        // GUARANTEE chatId exists
        const chatId = chat?._id?.toString();
        if (!chatId) {
          socket.emit("error", "Chat could not be created");
          return;
        }

        // Save message
        const newMessage = await Message.create({
          chatId,
          sender: userId,
          receiver: receiverId,
          text: simpleEncrypt(text.trim()), // save encrypted
          timestamp: new Date(),
        });

        const payload = {
          chatId,
          sender: userEmail,
          text: simpleDecrypt(newMessage.text), // send decrypted text
          timestamp: newMessage.timestamp,
        };

        // Send to sender
        io.to(socket.id).emit("receiveMessage", payload);

        // Send to receiver if online
        const receiverUser = onlineUsers.find(
          (u) => u.email === receiverEmail
        );
        if (receiverUser) {
          io.to(receiverUser.socketId).emit("receiveMessage", payload);
        }

      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // -------------------------
    // DISCONNECT
    // -------------------------
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
      console.log("❌ User disconnected:", userEmail);

      io.emit("onlineUsers", onlineUsers.map((u) => u.email));
    });
  });
};
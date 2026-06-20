import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatSidebar from "./ChatSidebar";
import "./Chat.css";
import Navbar1 from "../Profile/Navbar1";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: { token: localStorage.getItem("authToken") },
});

type ChatProps = {
  onLogout?: () => void;
};

const Chat: React.FC<ChatProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFriendEmail, setActiveFriendEmail] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const userIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem("currentStudent");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUserEmail(parsed.email);
    userIdRef.current = parsed.id;

    socket.auth = { token: localStorage.getItem("authToken") };
  }, []);

  // Socket listener
  useEffect(() => {
    socket.on("receiveMessage", (msg: any) => {
      if (msg.chatId !== chatId) return;

      setMessages((prev) => [
        ...prev,
        {
          sender: msg.sender,
          text: msg.text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  // Auto-scroll only the messages box, not the page
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesBox = messagesEndRef.current.closest('.messages-box');
      if (messagesBox) {
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    }
  }, [messages]);


  // =====================================
  //        OPEN CHAT FIXED VERSION
  // =====================================
  const openChatWithFriend = async (friendEmail: string) => {
    setActiveFriendEmail(friendEmail);

    const token = localStorage.getItem("authToken");
    const userId = userIdRef.current;

    if (!token || !userId) return;

    // Connect socket once
    if (!socket.connected) {
      socket.connect();
      socket.emit("join");
    }

    try {
      // 1️⃣ Get receiver ID
      const resReceiver = await fetch(
        `http://localhost:5000/api/registered/student/${friendEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const receiverData = await resReceiver.json();
      const receiverId = receiverData.id;

      // 2️⃣ Get or create chatId
      const resChat = await fetch("http://localhost:5000/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: userId,
          friendId: receiverId,
        }),
      });

      const chatData = await resChat.json();
      const newChatId = chatData.chat._id;
      setChatId(newChatId);

      // 3️⃣ Load message history
      const resMessages = await fetch(
        `http://localhost:5000/api/message/${newChatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msgData = await resMessages.json();

      const formatted = msgData.map((m: any) => ({
        sender: m.sender.email,
        text: m.text,
        timestamp: new Date(m.timestamp).toLocaleTimeString(),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };


  // =====================================
  //            SEND MESSAGE
  // =====================================
  const sendMessage = () => {
    if (!text.trim() || !activeFriendEmail || !chatId) return;

    socket.emit("sendMessage", {
      receiverEmail: activeFriendEmail,
      text,
    });

    setText("");
  };


  return (
  <>
    <Navbar1 onLogout={onLogout} />
    <div className="chat-container">
      <ChatSidebar
        onSelectFriend={openChatWithFriend}
        userEmail={userEmail}
        activeFriend={activeFriendEmail || ""}
      />

      <div className="chat-area">
        {activeFriendEmail ? (
          <>
            <h2 className="chat-header">{activeFriendEmail}</h2>

            <div className="messages-box">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.sender === userEmail
                      ? "message message-sent"
                      : "message message-received"
                  }
                >
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="input-box">
              <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p className="no-chat">Select a friend to start chatting</p>
        )}
      </div>
    </div>
  </>
);

};

export default Chat;
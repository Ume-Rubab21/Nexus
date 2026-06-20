import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("authToken"),
  },
});

type TestChatProps = {
  onLogout?: () => void;
};

const TestChat: React.FC<TestChatProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; text: string; timestamp: string }[]
  >([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: msg.sender,
          text: msg.text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        },
      ]);
    });

    socket.on("error", (error) => {
      alert("Error: " + error);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("error");
    };
  }, []);

  const connectUser = () => {
    if (!userEmail || !receiverEmail) {
      alert("Please enter both your email and receiver's email.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login first!");
      return;
    }

    socket.auth = { token };
    socket.connect();
    socket.emit("join");
    setConnected(true);
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;

    const fetchChatAndMessages = async () => {
      try {
        const receiverRes = await fetch(`http://localhost:5000/api/registered/student/${receiverEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const receiverData = await receiverRes.json();
        const receiverId = receiverData.id;

        const chatRes = await fetch("http://localhost:5000/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ studentId: userId, friendId: receiverId }),
        });
        const chatData = await chatRes.json();
        const chatId = chatData.chat._id;

        const msgRes = await fetch(`http://localhost:5000/api/message/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const messagesData = await msgRes.json();
        const formattedMsgs = messagesData.map((msg: any) => ({
          sender: msg.sender.email,
          text: msg.text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
        }));
        setMessages(formattedMsgs);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    fetchChatAndMessages();
  };

  const sendMessage = () => {
    if (!text) return;

    socket.emit("sendMessage", {
      receiverEmail,
      text,
    });

    setText("");
  };

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>💬 Real-Time Chat</h2>
      <button
        onClick={handleLogout}
        style={{ marginBottom: 20, padding: 10, background: "#dc3545", color: "white", border: "none", borderRadius: 5 }}
      >
        Logout
      </button>

      {!connected ? (
        <div style={{ marginBottom: 20 }}>
          <h3>Login to Chat</h3>
          <input
            placeholder="Enter YOUR email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            placeholder="Enter RECEIVER's email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={connectUser}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Connect
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              minHeight: "300px",
              maxHeight: "400px",
              overflowY: "auto",
              marginBottom: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.sender === userEmail ? "right" : "left",
                }}
              >
                <strong>{msg.sender}:</strong> {msg.text} <em>({msg.timestamp})</em>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestChat;

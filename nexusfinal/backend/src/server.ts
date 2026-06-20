import { socketHandler } from "./socket/socketHandler";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import studentRoutes from "./routes/studentRoutes"; // ✅ added
import nonRegisteredRoutes from "./routes/nonRegisteredRoutes";
import registeredRoutes from "./routes/registeredRoutes";
import adminRoutes from "./routes/adminRoutes";
import societyRoutes from "./routes/societyRoutes";
import eventRoutes from "./routes/eventRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import ChatRoutes from "./routes/ChatRoutes";
import MessageRoutes from "./routes/MessageRoutes";
import profileRoutes from "./routes/ProfileRoutes";
import friendRequestRoutes from "./routes/friendRequestRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/nonRegistered", nonRegisteredRoutes);
app.use("/api/registered", registeredRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/societies",societyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/profiles", profileRoutes); // ✅ mount profile routes
app.use("/api/friendrequests", friendRequestRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Campus Connect backend is running 🚀");
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json()); // JSON parse için

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "OkeyOnline Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Routes
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import userRoutes from "./routes/users.js";

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

// Socket.io Connection Handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Verify JWT token
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.id;
    socket.username = decoded.username;
    next();
  } catch (error) {
    console.log("Socket authentication error:", error.message);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.username} (${socket.userId})`);

  // Handle user joining a room
  socket.on("join-room", async (data) => {
    try {
      const { roomId } = data;
      socket.join(roomId);
      console.log(`${socket.username} joined room: ${roomId}`);

      // Broadcast to room that user joined
      socket.to(roomId).emit("user-joined", {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date(),
      });

      socket.emit("joined-room", { roomId });
    } catch (error) {
      console.error("Join room error:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle user leaving a room
  socket.on("leave-room", async (data) => {
    try {
      const { roomId } = data;
      socket.leave(roomId);
      console.log(`${socket.username} left room: ${roomId}`);

      // Broadcast to room that user left
      socket.to(roomId).emit("user-left", {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Leave room error:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.username} (${socket.userId})`);
  });

  // Handle connection errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.username}:`, error);
  });
});

// Make io available globally for routes
global.io = io;

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 OkeyOnline Server running on port ${PORT}`);
  console.log(`🔌 Socket.io ready for real-time connections`);
});

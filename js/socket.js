// Socket.io Client for OkeyOnline
// Real-time communication with backend

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.user = null;
  }

  // Initialize socket connection
  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    console.log("🔌 Connecting to Socket.io server...");

    this.socket = io("http://localhost:5000", {
      auth: { token: token },
      transports: ["websocket", "polling"],
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup all socket event listeners
  setupEventListeners() {
    // Connection events
    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.io server");
      this.isConnected = true;
      this.emit("connection-status", { status: "connected" });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.io server:", reason);
      this.isConnected = false;
      this.emit("connection-status", { status: "disconnected", reason });
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error.message);
      this.emit("connection-error", error);
    });

    // Room events
    this.socket.on("joined-room", (data) => {
      console.log("📍 Joined room:", data.roomId);
      this.currentRoom = data.roomId;
      this.emit("room-joined", data);
    });

    this.socket.on("user-joined", (data) => {
      console.log("👤 User joined room:", data.username);
      this.emit("user-joined-room", data);
    });

    this.socket.on("user-left", (data) => {
      console.log("👋 User left room:", data.username);
      this.emit("user-left-room", data);
    });

    // Chat events
    this.socket.on("new-message", (data) => {
      console.log("💬 New message:", data);
      this.emit("new-chat-message", data);
    });

    // Game events
    this.socket.on("game-update", (data) => {
      console.log("🎮 Game update:", data);
      this.emit("game-state-update", data);
    });

    this.socket.on("game-started", (data) => {
      console.log("🎯 Game started:", data);
      this.emit("game-started", data);
    });

    this.socket.on("game-ended", (data) => {
      console.log("🏁 Game ended:", data);
      this.emit("game-ended", data);
    });

    // Error handling
    this.socket.on("error", (error) => {
      console.error("🔌 Socket error:", error);
      this.emit("socket-error", error);
    });
  }

  // Room management methods
  joinRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      console.error("❌ Socket not connected");
      return false;
    }

    console.log("📍 Joining room:", roomId);
    this.socket.emit("join-room", { roomId });
    return true;
  }

  leaveRoom(roomId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    console.log("📍 Leaving room:", roomId);
    this.socket.emit("leave-room", { roomId });
    this.currentRoom = null;
    return true;
  }

  // Chat methods
  sendMessage(message) {
    if (!this.socket || !this.isConnected || !this.currentRoom) {
      console.error("❌ Cannot send message: not connected or not in room");
      return false;
    }

    this.socket.emit("send-message", {
      roomId: this.currentRoom,
      message: message,
      timestamp: new Date(),
    });
    return true;
  }

  // Game methods
  sendGameAction(action, data) {
    if (!this.socket || !this.isConnected || !this.currentRoom) {
      console.error("❌ Cannot send game action: not connected or not in room");
      return false;
    }

    this.socket.emit("game-action", {
      roomId: this.currentRoom,
      action: action,
      data: data,
      timestamp: new Date(),
    });
    return true;
  }

  // Utility methods
  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting from Socket.io server...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
    }
  }

  // Event emitter for frontend components
  on(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners && this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in event callback:", error);
        }
      });
    }
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      currentRoom: this.currentRoom,
      socketId: this.socket ? this.socket.id : null,
    };
  }
}

// Create global instance
const socketManager = new SocketManager();

// Export for use in other files
window.SocketManager = SocketManager;
window.socketManager = socketManager;

export default socketManager;

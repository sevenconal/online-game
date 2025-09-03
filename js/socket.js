// Socket.io Client for OkeyOnline
// Real-time communication with backend

// Socket.io loaded from CDN - available as global 'io'

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.user = null;
  }

  // Initialize socket connection with enhanced error handling
  connect(token) {
    try {
      if (this.socket) {
        window.logger.info("Disconnecting existing socket connection");
        this.socket.disconnect();
      }

      window.logger.info("🔌 Connecting to Socket.io server...");
      window.logger.debug("🔑 Token status:", token ? "Present" : "Missing");

      if (!token) {
        const error = new Error("No token provided for socket connection");
        window.logger.error(
          "Socket connection failed: no token",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Oturum açmanız gerekiyor.", "error");
        }
        return null;
      }

      // Check if io is available
      if (typeof io === "undefined") {
        const error = new Error("Socket.io library not loaded");
        window.logger.critical(
          "Socket.io library not available",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification(
            "Bağlantı kütüphanesi yüklenemedi. Sayfayı yenileyin.",
            "error"
          );
        }
        return null;
      }

      this.socket = io("http://localhost:5000", {
        auth: { token: token },
        transports: ["websocket", "polling"],
        timeout: 5000,
        forceNew: true,
      });

      this.setupEventListeners();
      window.logger.info("Socket connection initialized");
      return this.socket;
    } catch (error) {
      window.logger.critical(
        "Socket connection initialization failed",
        error,
        "socket"
      );
      if (window.showNotification) {
        window.showNotification("Sunucu bağlantısı kurulamadı.", "error");
      }
      return null;
    }
  }

  // Setup all socket event listeners with enhanced error handling
  setupEventListeners() {
    try {
      window.logger.info("Setting up socket event listeners");

      // Connection events
      this.socket.on("connect", () => {
        try {
          window.logger.info("✅ Connected to Socket.io server");
          this.isConnected = true;
          this.emit("connection-status", { status: "connected" });
          if (window.showNotification) {
            window.showNotification("Sunucuya bağlandınız!", "success");
          }
        } catch (error) {
          window.logger.error("Connect event handler error", error, "socket");
        }
      });

      this.socket.on("disconnect", (reason) => {
        try {
          window.logger.warn("❌ Disconnected from Socket.io server", {
            reason,
          });
          this.isConnected = false;
          this.emit("connection-status", { status: "disconnected", reason });

          // Show user-friendly disconnect message
          let message = "Sunucu bağlantısı kesildi.";
          if (reason === "io server disconnect") {
            message = "Sunucu tarafından bağlantı kesildi.";
          } else if (reason === "io client disconnect") {
            message = "İstemci bağlantısı kesildi.";
          } else if (reason === "ping timeout") {
            message = "Bağlantı zaman aşımına uğradı.";
          }

          if (window.showNotification) {
            window.showNotification(message, "warning");
          }
        } catch (error) {
          window.logger.error(
            "Disconnect event handler error",
            error,
            "socket"
          );
        }
      });

      this.socket.on("connect_error", (error) => {
        try {
          window.logger.error("🔌 Socket connection error", error, "socket");
          this.emit("connection-error", error);

          if (window.showNotification) {
            window.showNotification(
              "Sunucuya bağlanılamadı. Yeniden bağlanmaya çalışılıyor...",
              "error"
            );
          }
        } catch (error) {
          window.logger.error(
            "Connect error event handler error",
            error,
            "socket"
          );
        }
      });

      this.socket.on("reconnect", (attemptNumber) => {
        try {
          window.logger.info("🔄 Reconnected to Socket.io server", {
            attemptNumber,
          });
          this.isConnected = true;
          if (window.showNotification) {
            window.showNotification("Sunucuya yeniden bağlandınız!", "success");
          }
        } catch (error) {
          window.logger.error("Reconnect event handler error", error, "socket");
        }
      });

      this.socket.on("reconnect_error", (error) => {
        try {
          window.logger.error("🔄 Reconnection failed", error, "socket");
          if (window.showNotification) {
            window.showNotification(
              "Yeniden bağlantı başarısız. Lütfen sayfayı yenileyin.",
              "error"
            );
          }
        } catch (error) {
          window.logger.error(
            "Reconnect error event handler error",
            error,
            "socket"
          );
        }
      });

      this.socket.on("reconnect_failed", () => {
        try {
          window.logger.critical(
            "Reconnection failed permanently",
            null,
            "socket"
          );
          if (window.showNotification) {
            window.showNotification(
              "Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.",
              "error"
            );
          }
        } catch (error) {
          window.logger.error(
            "Reconnect failed event handler error",
            error,
            "socket"
          );
        }
      });

      window.logger.info("Socket event listeners setup completed");
    } catch (error) {
      window.logger.critical(
        "Failed to setup socket event listeners",
        error,
        "socket"
      );
    }

    // Room events with error handling
    this.socket.on("joined-room", (data) => {
      try {
        window.logger.info("📍 Joined room", { roomId: data.roomId });
        this.currentRoom = data.roomId;
        this.emit("room-joined", data);
      } catch (error) {
        window.logger.error("Joined room event handler error", error, "socket");
      }
    });

    this.socket.on("user-joined", (data) => {
      try {
        window.logger.info("👤 User joined room", { username: data.username });
        this.emit("user-joined-room", data);
      } catch (error) {
        window.logger.error("User joined event handler error", error, "socket");
      }
    });

    this.socket.on("user-left", (data) => {
      try {
        window.logger.info("👋 User left room", { username: data.username });
        this.emit("user-left-room", data);
      } catch (error) {
        window.logger.error("User left event handler error", error, "socket");
      }
    });

    this.socket.on("room-error", (error) => {
      try {
        window.logger.error("Room error", error, "socket");
        this.emit("room-error", error);
        if (window.showNotification) {
          window.showNotification("Oda işleminde hata oluştu.", "error");
        }
      } catch (error) {
        window.logger.error("Room error event handler error", error, "socket");
      }
    });

    // Chat events with error handling
    this.socket.on("new-message", (data) => {
      try {
        window.logger.debug("💬 New message received", {
          messageLength: data.message?.length,
        });
        this.emit("new-chat-message", data);
      } catch (error) {
        window.logger.error("New message event handler error", error, "socket");
      }
    });

    this.socket.on("message-error", (error) => {
      try {
        window.logger.error("Message error", error, "socket");
        this.emit("message-error", error);
        if (window.showNotification) {
          window.showNotification("Mesaj gönderilemedi.", "error");
        }
      } catch (error) {
        window.logger.error(
          "Message error event handler error",
          error,
          "socket"
        );
      }
    });

    this.socket.on("typing-start", (data) => {
      try {
        window.logger.debug("Typing started", { username: data.username });
        this.emit("typing-start", data);
      } catch (error) {
        window.logger.error(
          "Typing start event handler error",
          error,
          "socket"
        );
      }
    });

    this.socket.on("typing-stop", (data) => {
      try {
        window.logger.debug("Typing stopped", { username: data.username });
        this.emit("typing-stop", data);
      } catch (error) {
        window.logger.error("Typing stop event handler error", error, "socket");
      }
    });

    // User presence events
    this.socket.on("user-online", (data) => {
      console.log("🟢 User online:", data.username);
      this.emit("user-online", data);
    });

    this.socket.on("user-offline", (data) => {
      console.log("🔴 User offline:", data.username);
      this.emit("user-offline", data);
    });

    this.socket.on("online-users", (data) => {
      console.log("👥 Online users list:", data.users);
      this.emit("online-users", data);
    });

    // Game state events
    this.socket.on("game-state-update", (data) => {
      console.log("🎮 Game state update:", data);
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

    this.socket.on("player-joined-game", (data) => {
      console.log("👤 Player joined game:", data);
      this.emit("player-joined-game", data);
    });

    this.socket.on("player-left-game", (data) => {
      console.log("👋 Player left game:", data);
      this.emit("player-left-game", data);
    });

    this.socket.on("table-status-changed", (data) => {
      console.log("📊 Table status changed:", data);
      this.emit("table-status-changed", data);
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

  // Room management methods with enhanced error handling
  joinRoom(roomId) {
    try {
      if (!this.socket || !this.isConnected) {
        const error = new Error("Socket not connected");
        window.logger.error(
          "Cannot join room: socket not connected",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Sunucuya bağlı değilsiniz.", "error");
        }
        return false;
      }

      if (!roomId) {
        const error = new Error("Room ID is required");
        window.logger.error(
          "Cannot join room: invalid room ID",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Geçersiz oda ID'si.", "error");
        }
        return false;
      }

      window.logger.info("📍 Joining room", { roomId });
      this.socket.emit("join-room", { roomId });
      return true;
    } catch (error) {
      window.logger.error("Join room error", error, "socket");
      if (window.showNotification) {
        window.showNotification("Odaya katılırken hata oluştu.", "error");
      }
      return false;
    }
  }

  leaveRoom(roomId) {
    try {
      if (!this.socket || !this.isConnected) {
        window.logger.warn("Cannot leave room: socket not connected", {
          roomId,
        });
        return false;
      }

      if (!roomId) {
        window.logger.warn("Cannot leave room: invalid room ID", { roomId });
        return false;
      }

      window.logger.info("📍 Leaving room", { roomId });
      this.socket.emit("leave-room", { roomId });
      this.currentRoom = null;
      return true;
    } catch (error) {
      window.logger.error("Leave room error", error, "socket");
      return false;
    }
  }

  // Chat methods with enhanced error handling
  sendMessage(message) {
    try {
      if (!this.socket || !this.isConnected) {
        const error = new Error("Socket not connected");
        window.logger.error(
          "Cannot send message: socket not connected",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Sunucuya bağlı değilsiniz.", "error");
        }
        return false;
      }

      if (!this.currentRoom) {
        const error = new Error("Not in a room");
        window.logger.error(
          "Cannot send message: not in room",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Herhangi bir odada değilsiniz.", "error");
        }
        return false;
      }

      if (!message || message.trim().length === 0) {
        const error = new Error("Empty message");
        window.logger.warn(
          "Cannot send message: empty message",
          error,
          "socket"
        );
        if (window.showNotification) {
          window.showNotification("Mesaj boş olamaz.", "warning");
        }
        return false;
      }

      if (message.length > 500) {
        const error = new Error("Message too long");
        window.logger.warn(
          "Cannot send message: message too long",
          { length: message.length },
          "socket"
        );
        if (window.showNotification) {
          window.showNotification(
            "Mesaj çok uzun (max 500 karakter).",
            "warning"
          );
        }
        return false;
      }

      window.logger.debug("Sending message", { messageLength: message.length });
      this.socket.emit("send-message", {
        roomId: this.currentRoom,
        message: message.trim(),
        timestamp: new Date(),
      });
      return true;
    } catch (error) {
      window.logger.error("Send message error", error, "socket");
      if (window.showNotification) {
        window.showNotification("Mesaj gönderilemedi.", "error");
      }
      return false;
    }
  }

  // Typing indicators
  startTyping() {
    try {
      if (!this.socket || !this.isConnected || !this.currentRoom) {
        return false;
      }

      this.socket.emit("typing-start", {
        roomId: this.currentRoom,
        timestamp: new Date(),
      });
      return true;
    } catch (error) {
      window.logger.error("Start typing error", error, "socket");
      return false;
    }
  }

  stopTyping() {
    try {
      if (!this.socket || !this.isConnected || !this.currentRoom) {
        return false;
      }

      this.socket.emit("typing-stop", {
        roomId: this.currentRoom,
        timestamp: new Date(),
      });
      return true;
    } catch (error) {
      window.logger.error("Stop typing error", error, "socket");
      return false;
    }
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

  // Utility methods with enhanced error handling
  disconnect() {
    try {
      if (this.socket) {
        window.logger.info("🔌 Disconnecting from Socket.io server...");
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
        this.currentRoom = null;
        this.user = null;
        window.logger.info("Successfully disconnected from Socket.io server");
      } else {
        window.logger.debug("Disconnect called but no socket exists");
      }
    } catch (error) {
      window.logger.error("Disconnect error", error, "socket");
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

// Make available globally for non-module usage
window.SocketManager = SocketManager;
window.socketManager = socketManager;

// Socket manager is now available globally

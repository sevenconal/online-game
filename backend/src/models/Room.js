import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Oda adı gereklidir"],
      trim: true,
      maxlength: [50, "Oda adı en fazla 50 karakter olabilir"],
    },

    gameType: {
      type: String,
      required: [true, "Oyun türü gereklidir"],
      enum: {
        values: ["okey", "batak", "tavla", "pisti"],
        message: "Geçersiz oyun türü",
      },
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        maxlength: [4, "Bir odada en fazla 4 oyuncu olabilir"],
      },
    ],

    maxPlayers: {
      type: Number,
      default: 4,
      min: [2, "En az 2 oyuncu gerekli"],
      max: [4, "En fazla 4 oyuncu olabilir"],
    },

    status: {
      type: String,
      enum: {
        values: ["waiting", "playing", "finished", "cancelled"],
        message: "Geçersiz oda durumu",
      },
      default: "waiting",
    },

    betAmount: {
      type: Number,
      default: 100,
      min: [10, "Bahis miktarı en az 10 olabilir"],
      max: [10000, "Bahis miktarı en fazla 10000 olabilir"],
    },

    settings: {
      type: Object,
      default: {
        timeLimit: 30, // dakika
        autoStart: true,
        allowSpectators: true,
        privateRoom: false,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currentGame: {
      gameId: String,
      startedAt: Date,
      players: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          position: {
            type: String,
            enum: ["top", "right", "bottom", "left"],
          },
          score: { type: Number, default: 0 },
          isReady: { type: Boolean, default: false },
        },
      ],
      gameData: Object, // Oyun durumu (taşlar, skorlar vb.)
      winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    spectators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    chatMessages: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        message: {
          type: String,
          maxlength: [200, "Mesaj en fazla 200 karakter olabilir"],
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    statistics: {
      totalGames: { type: Number, default: 0 },
      totalPlayers: { type: Number, default: 0 },
      averageGameTime: { type: Number, default: 0 },
      totalBetAmount: { type: Number, default: 0 },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      select: false, // Özel odalar için
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for current player count
roomSchema.virtual("currentPlayerCount").get(function () {
  return this.players.length;
});

// Virtual for available slots
roomSchema.virtual("availableSlots").get(function () {
  return this.maxPlayers - this.players.length;
});

// Virtual for is room full
roomSchema.virtual("isFull").get(function () {
  return this.players.length >= this.maxPlayers;
});

// Virtual for can start game
roomSchema.virtual("canStartGame").get(function () {
  return this.players.length >= 2 && this.status === "waiting";
});

// Index for better query performance
roomSchema.index({ gameType: 1, status: 1 });
roomSchema.index({ createdBy: 1 });
roomSchema.index({ roomId: 1 }, { unique: true });
roomSchema.index({ isActive: 1 });
roomSchema.index({ createdAt: -1 });

// Pre-save middleware
roomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Instance methods
roomSchema.methods.addPlayer = function (userId) {
  if (this.players.length >= this.maxPlayers) {
    throw new Error("Oda dolu");
  }

  if (this.players.includes(userId)) {
    throw new Error("Kullanıcı zaten odada");
  }

  this.players.push(userId);
  return this.save();
};

roomSchema.methods.removePlayer = function (userId) {
  this.players = this.players.filter((id) => !id.equals(userId));
  return this.save();
};

roomSchema.methods.startGame = function () {
  if (this.players.length < 2) {
    throw new Error("Oyunu başlatmak için en az 2 oyuncu gerekli");
  }

  this.status = "playing";
  this.currentGame = {
    gameId: "game_" + Date.now(),
    startedAt: new Date(),
    players: this.players.map((userId, index) => ({
      userId,
      position: ["top", "right", "bottom", "left"][index],
      score: 0,
      isReady: true,
    })),
    gameData: {},
  };

  return this.save();
};

roomSchema.methods.endGame = function (winnerId, finalScores) {
  this.status = "finished";
  this.currentGame.winner = winnerId;

  // Update player scores
  if (finalScores) {
    this.currentGame.players.forEach((player) => {
      const score = finalScores[player.userId] || 0;
      player.score = score;
    });
  }

  // Update room statistics
  this.statistics.totalGames += 1;

  return this.save();
};

roomSchema.methods.addChatMessage = function (userId, username, message) {
  this.chatMessages.push({
    userId,
    username,
    message,
    timestamp: new Date(),
  });

  // Keep only last 50 messages
  if (this.chatMessages.length > 50) {
    this.chatMessages = this.chatMessages.slice(-50);
  }

  return this.save();
};

// Static methods
roomSchema.statics.findActiveRooms = function (gameType = null) {
  const query = { isActive: true, status: { $in: ["waiting", "playing"] } };
  if (gameType) {
    query.gameType = gameType;
  }
  return this.find(query)
    .populate("players", "username avatar")
    .sort({ createdAt: -1 });
};

roomSchema.statics.findUserRooms = function (userId) {
  return this.find({
    $or: [{ players: userId }, { spectators: userId }],
    isActive: true,
  }).populate("players", "username avatar");
};

const Room = mongoose.model("Room", roomSchema);

export default Room;

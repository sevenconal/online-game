import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Kullanıcı adı gereklidir"],
      unique: true,
      trim: true,
      minlength: [3, "Kullanıcı adı en az 3 karakter olmalıdır"],
      maxlength: [20, "Kullanıcı adı en fazla 20 karakter olabilir"],
    },

    email: {
      type: String,
      required: [true, "Email gereklidir"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Geçerli bir email adresi girin",
      ],
    },

    password: {
      type: String,
      required: [true, "Şifre gereklidir"],
      minlength: [6, "Şifre en az 6 karakter olmalıdır"],
      select: false, // Query'lerde şifreyi döndürme
    },

    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
      },
    },

    goldCoins: {
      type: Number,
      default: 1000,
      min: [0, "Gold coin miktarı 0'dan küçük olamaz"],
    },

    level: {
      type: Number,
      default: 1,
      min: [1, "Level en az 1 olabilir"],
    },

    stats: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
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

// Virtual for user's full profile
userSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    goldCoins: this.goldCoins,
    level: this.level,
    stats: this.stats,
    isOnline: this.isOnline,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
});

// Index for better query performance
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isOnline: 1 });
userSchema.index({ level: -1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update stats
userSchema.methods.updateStats = function (gameResult, score) {
  this.stats.gamesPlayed += 1;

  if (gameResult === "win") {
    this.stats.gamesWon += 1;
  }

  this.stats.totalScore += score;
  this.stats.winRate = (this.stats.gamesWon / this.stats.gamesPlayed) * 100;

  return this.save();
};

// Static method to find user by username or email
userSchema.statics.findByUsernameOrEmail = function (identifier) {
  return this.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
};

const User = mongoose.model("User", userSchema, "okeyonline_users");

export default User;

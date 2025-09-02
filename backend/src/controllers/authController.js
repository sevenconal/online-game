import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tüm alanlar gereklidir" });
    }

    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .json({ error: "Kullanıcı adı 3-20 karakter arasında olmalıdır" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Bu kullanıcı adı veya email zaten kullanılıyor",
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // JWT oluştur
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        goldCoins: newUser.goldCoins,
        level: newUser.level,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Kayıt işlemi başarısız" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email ve şifre gereklidir" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Kullanıcı bulunamadı",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz kimlik bilgileri",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.isOnline = true;
    await user.save();

    // JWT oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      message: "Giriş başarılı!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        goldCoins: user.goldCoins,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Giriş işlemi başarısız" });
  }
};

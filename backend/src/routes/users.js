import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Find user by ID from token
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Kullanıcı bulunamadı",
      });
    }

    // Return user profile (without password)
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        goldCoins: user.goldCoins,
        level: user.level,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Profil bilgileri alınırken hata oluştu",
    });
  }
});

export default router;

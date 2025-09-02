import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all rooms
router.get("/", (req, res) => {
  try {
    // TODO: Get rooms from database
    const mockRooms = [
      {
        id: "room1",
        name: "Okey 101",
        gameType: "okey",
        players: 25,
        maxPlayers: 100,
        status: "waiting",
        betAmount: 100,
      },
      {
        id: "room2",
        name: "Batak Salonu",
        gameType: "batak",
        players: 15,
        maxPlayers: 100,
        status: "playing",
        betAmount: 50,
      },
    ];

    res.json({
      success: true,
      data: mockRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Oda bilgileri alınırken hata oluştu",
    });
  }
});

// Get specific room
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Get room from database
    const mockRoom = {
      id: id,
      name: "Okey 101",
      gameType: "okey",
      players: [
        { id: "user1", username: "_RoBoT_", position: "top" },
        { id: "user2", username: "Weddy", position: "right" },
        { id: "user3", username: "Teo", position: "bottom" },
        { id: "user4", username: "Saruhan", position: "left" },
      ],
      maxPlayers: 100,
      status: "playing",
      betAmount: 100,
    };

    res.json({
      success: true,
      data: mockRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Oda bilgisi alınırken hata oluştu",
    });
  }
});

// Create new room
router.post("/", authMiddleware, (req, res) => {
  try {
    const { gameType, maxPlayers, betAmount } = req.body;

    // TODO: Create room in database
    const newRoom = {
      id: "room" + Date.now(),
      name: `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Salonu`,
      gameType,
      players: [req.user.id],
      maxPlayers: maxPlayers || 100,
      status: "waiting",
      betAmount: betAmount || 100,
      createdBy: req.user.id,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      data: newRoom,
      message: "Oda başarıyla oluşturuldu",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Oda oluşturulurken hata oluştu",
    });
  }
});

// Join room
router.post("/:id/join", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Add user to room in database
    res.json({
      success: true,
      message: "Odaya başarıyla katıldınız",
      roomId: id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Odaya katılarken hata oluştu",
    });
  }
});

// Leave room
router.delete("/:id/leave", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Remove user from room in database
    res.json({
      success: true,
      message: "Odadan başarıyla çıktınız",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Odadan çıkarken hata oluştu",
    });
  }
});

export default router;

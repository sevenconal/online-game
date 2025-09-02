// ==========================================
// GAME ROOMS API MODULE
// ==========================================

/**
 * Game Rooms API Service
 */
class RoomsAPI {
  /**
   * Get all available game rooms
   * @param {Object} filters - Optional filters
   * @param {string} filters.gameType - Game type filter ('okey', 'batak', 'tavla', 'pisti')
   * @param {string} filters.status - Room status filter ('waiting', 'playing')
   * @returns {Promise<ApiResponse>} Rooms list response
   */
  static async getRooms(filters = {}) {
    try {
      let queryString = "";

      if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams(filters);
        queryString = `?${params.toString()}`;
      }

      const response = await apiRequest(`/rooms${queryString}`);
      return response;
    } catch (error) {
      console.error("Get rooms error:", error);
      return ApiResponse.error("Oyun odaları yüklenirken hata oluştu");
    }
  }

  /**
   * Get specific room details
   * @param {string} roomId - Room ID
   * @returns {Promise<ApiResponse>} Room details response
   */
  static async getRoom(roomId) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}`);
      return response;
    } catch (error) {
      console.error("Get room error:", error);
      return ApiResponse.error("Oda bilgileri alınırken hata oluştu");
    }
  }

  /**
   * Create new game room
   * @param {Object} roomData - Room creation data
   * @param {string} roomData.gameType - Game type
   * @param {number} roomData.maxPlayers - Maximum players
   * @param {Object} roomData.settings - Game settings
   * @returns {Promise<ApiResponse>} Room creation response
   */
  static async createRoom(roomData) {
    try {
      // Validation
      if (!roomData.gameType || !roomData.maxPlayers) {
        return ApiResponse.error("Oyun türü ve maksimum oyuncu sayısı gerekli");
      }

      if (!["okey", "batak", "tavla", "pisti"].includes(roomData.gameType)) {
        return ApiResponse.error("Geçersiz oyun türü");
      }

      if (roomData.maxPlayers < 2 || roomData.maxPlayers > 4) {
        return ApiResponse.error("Oyuncu sayısı 2-4 arasında olmalıdır");
      }

      const response = await apiRequest("/rooms", {
        method: "POST",
        body: JSON.stringify({
          gameType: roomData.gameType,
          maxPlayers: roomData.maxPlayers,
          settings: roomData.settings || {},
        }),
      });

      return response;
    } catch (error) {
      console.error("Create room error:", error);
      return ApiResponse.error("Oda oluşturulurken hata oluştu");
    }
  }

  /**
   * Join a game room
   * @param {string} roomId - Room ID to join
   * @returns {Promise<ApiResponse>} Join room response
   */
  static async joinRoom(roomId) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}/join`, {
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Join room error:", error);
      return ApiResponse.error("Odaya katılarken hata oluştu");
    }
  }

  /**
   * Leave a game room
   * @param {string} roomId - Room ID to leave
   * @returns {Promise<ApiResponse>} Leave room response
   */
  static async leaveRoom(roomId) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}/leave`, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      console.error("Leave room error:", error);
      return ApiResponse.error("Odadan çıkarken hata oluştu");
    }
  }

  /**
   * Get user's active rooms
   * @returns {Promise<ApiResponse>} User's rooms response
   */
  static async getMyRooms() {
    try {
      const response = await apiRequest("/rooms/my-rooms");
      return response;
    } catch (error) {
      console.error("Get my rooms error:", error);
      return ApiResponse.error("Oda bilgileriniz alınırken hata oluştu");
    }
  }

  /**
   * Update room settings (room owner only)
   * @param {string} roomId - Room ID
   * @param {Object} settings - New settings
   * @returns {Promise<ApiResponse>} Update response
   */
  static async updateRoomSettings(roomId, settings) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}/settings`, {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      return response;
    } catch (error) {
      console.error("Update room settings error:", error);
      return ApiResponse.error("Oda ayarları güncellenirken hata oluştu");
    }
  }

  /**
   * Start game in room (room owner only)
   * @param {string} roomId - Room ID
   * @returns {Promise<ApiResponse>} Start game response
   */
  static async startGame(roomId) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}/start`, {
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Start game error:", error);
      return ApiResponse.error("Oyun başlatılırken hata oluştu");
    }
  }

  /**
   * Get room statistics
   * @param {string} roomId - Room ID
   * @returns {Promise<ApiResponse>} Room stats response
   */
  static async getRoomStats(roomId) {
    try {
      if (!roomId) {
        return ApiResponse.error("Oda ID gerekli");
      }

      const response = await apiRequest(`/rooms/${roomId}/stats`);
      return response;
    } catch (error) {
      console.error("Get room stats error:", error);
      return ApiResponse.error("Oda istatistikleri alınırken hata oluştu");
    }
  }

  /**
   * Search rooms by criteria
   * @param {Object} searchCriteria - Search parameters
   * @param {string} searchCriteria.gameType - Game type
   * @param {number} searchCriteria.minPlayers - Minimum players
   * @param {number} searchCriteria.maxPlayers - Maximum players
   * @returns {Promise<ApiResponse>} Search results response
   */
  static async searchRooms(searchCriteria) {
    try {
      const params = new URLSearchParams(searchCriteria);
      const response = await apiRequest(`/rooms/search?${params.toString()}`);
      return response;
    } catch (error) {
      console.error("Search rooms error:", error);
      return ApiResponse.error("Oda arama sırasında hata oluştu");
    }
  }
}

// Export for use in other modules
window.RoomsAPI = RoomsAPI;

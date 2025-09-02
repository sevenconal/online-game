// ==========================================
// USERS API MODULE
// ==========================================

/**
 * Users API Service
 */
class UsersAPI {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<ApiResponse>} User profile response
   */
  static async getUserProfile(userId) {
    try {
      if (!userId) {
        return ApiResponse.error("Kullanıcı ID gerekli");
      }

      const response = await apiRequest(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error("Get user profile error:", error);
      return ApiResponse.error("Kullanıcı profili alınırken hata oluştu");
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<ApiResponse>} Current user profile response
   */
  static async getCurrentProfile() {
    try {
      const response = await apiRequest("/users/profile");
      return response;
    } catch (error) {
      console.error("Get current profile error:", error);
      return ApiResponse.error("Profil bilgileriniz alınırken hata oluştu");
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @param {string} profileData.username - New username
   * @param {string} profileData.avatar - New avatar URL
   * @param {Object} profileData.settings - User settings
   * @returns {Promise<ApiResponse>} Update response
   */
  static async updateProfile(profileData) {
    try {
      if (!profileData || Object.keys(profileData).length === 0) {
        return ApiResponse.error("Güncellenecek veri gerekli");
      }

      // Validate username if provided
      if (profileData.username) {
        if (
          profileData.username.length < 3 ||
          profileData.username.length > 20
        ) {
          return ApiResponse.error(
            "Kullanıcı adı 3-20 karakter arasında olmalıdır"
          );
        }
      }

      const response = await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (response.success) {
        // Update local storage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      return ApiResponse.error("Profil güncellenirken hata oluştu");
    }
  }

  /**
   * Get user's game statistics
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<ApiResponse>} User statistics response
   */
  static async getUserStats(userId = null) {
    try {
      const endpoint = userId ? `/users/${userId}/stats` : "/users/stats";
      const response = await apiRequest(endpoint);
      return response;
    } catch (error) {
      console.error("Get user stats error:", error);
      return ApiResponse.error("İstatistikler alınırken hata oluştu");
    }
  }

  /**
   * Get user's game history
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of games to fetch
   * @param {number} options.offset - Offset for pagination
   * @param {string} options.gameType - Filter by game type
   * @returns {Promise<ApiResponse>} Game history response
   */
  static async getGameHistory(options = {}) {
    try {
      const params = new URLSearchParams(options);
      const response = await apiRequest(
        `/users/game-history?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.error("Get game history error:", error);
      return ApiResponse.error("Oyun geçmişi alınırken hata oluştu");
    }
  }

  /**
   * Get user's friends list
   * @returns {Promise<ApiResponse>} Friends list response
   */
  static async getFriends() {
    try {
      const response = await apiRequest("/users/friends");
      return response;
    } catch (error) {
      console.error("Get friends error:", error);
      return ApiResponse.error("Arkadaş listesi alınırken hata oluştu");
    }
  }

  /**
   * Send friend request
   * @param {string} targetUserId - Target user ID
   * @returns {Promise<ApiResponse>} Friend request response
   */
  static async sendFriendRequest(targetUserId) {
    try {
      if (!targetUserId) {
        return ApiResponse.error("Hedef kullanıcı ID gerekli");
      }

      const response = await apiRequest("/users/friends/request", {
        method: "POST",
        body: JSON.stringify({ targetUserId }),
      });

      return response;
    } catch (error) {
      console.error("Send friend request error:", error);
      return ApiResponse.error("Arkadaşlık isteği gönderilirken hata oluştu");
    }
  }

  /**
   * Accept friend request
   * @param {string} requestId - Friend request ID
   * @returns {Promise<ApiResponse>} Accept response
   */
  static async acceptFriendRequest(requestId) {
    try {
      if (!requestId) {
        return ApiResponse.error("İstek ID gerekli");
      }

      const response = await apiRequest(`/users/friends/accept/${requestId}`, {
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Accept friend request error:", error);
      return ApiResponse.error("Arkadaşlık isteği kabul edilirken hata oluştu");
    }
  }

  /**
   * Decline friend request
   * @param {string} requestId - Friend request ID
   * @returns {Promise<ApiResponse>} Decline response
   */
  static async declineFriendRequest(requestId) {
    try {
      if (!requestId) {
        return ApiResponse.error("İstek ID gerekli");
      }

      const response = await apiRequest(`/users/friends/decline/${requestId}`, {
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Decline friend request error:", error);
      return ApiResponse.error("Arkadaşlık isteği reddedilirken hata oluştu");
    }
  }

  /**
   * Remove friend
   * @param {string} friendId - Friend user ID
   * @returns {Promise<ApiResponse>} Remove response
   */
  static async removeFriend(friendId) {
    try {
      if (!friendId) {
        return ApiResponse.error("Arkadaş ID gerekli");
      }

      const response = await apiRequest(`/users/friends/${friendId}`, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      console.error("Remove friend error:", error);
      return ApiResponse.error("Arkadaş silinirken hata oluştu");
    }
  }

  /**
   * Search users
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<ApiResponse>} Search results response
   */
  static async searchUsers(query, options = {}) {
    try {
      if (!query || query.trim().length < 2) {
        return ApiResponse.error("Arama için en az 2 karakter gerekli");
      }

      const params = new URLSearchParams({ q: query.trim(), ...options });
      const response = await apiRequest(`/users/search?${params.toString()}`);
      return response;
    } catch (error) {
      console.error("Search users error:", error);
      return ApiResponse.error("Kullanıcı arama sırasında hata oluştu");
    }
  }

  /**
   * Get online users
   * @returns {Promise<ApiResponse>} Online users response
   */
  static async getOnlineUsers() {
    try {
      const response = await apiRequest("/users/online");
      return response;
    } catch (error) {
      console.error("Get online users error:", error);
      return ApiResponse.error("Çevrimiçi kullanıcılar alınırken hata oluştu");
    }
  }

  /**
   * Update user avatar
   * @param {File} avatarFile - Avatar image file
   * @returns {Promise<ApiResponse>} Upload response
   */
  static async updateAvatar(avatarFile) {
    try {
      if (!avatarFile) {
        return ApiResponse.error("Avatar dosyası gerekli");
      }

      // Validate file type
      if (!avatarFile.type.startsWith("image/")) {
        return ApiResponse.error("Sadece resim dosyaları kabul edilir");
      }

      // Validate file size (max 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return ApiResponse.error("Dosya boyutu 5MB'dan küçük olmalıdır");
      }

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await apiRequest("/users/avatar", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });

      if (response.success) {
        // Update local storage
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, avatar: response.data.avatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response;
    } catch (error) {
      console.error("Update avatar error:", error);
      return ApiResponse.error("Avatar güncellenirken hata oluştu");
    }
  }
}

// Export for use in other modules
window.UsersAPI = UsersAPI;

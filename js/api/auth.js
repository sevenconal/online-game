// ==========================================
// AUTHENTICATION API MODULE
// ==========================================

/**
 * Authentication API Service
 */
class AuthAPI {
  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<ApiResponse>} Login response
   */
  static async login(credentials) {
    try {
      // Input validation
      if (!credentials.email || !credentials.password) {
        return ApiResponse.error("Email ve şifre gereklidir");
      }

      if (!this.isValidEmail(credentials.email)) {
        return ApiResponse.error("Geçerli bir email adresi girin");
      }

      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (response.success) {
        // Store auth data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return ApiResponse.success({
          user: response.data.user,
          token: response.data.token,
        });
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return ApiResponse.error("Giriş yapılırken bir hata oluştu");
    }
  }

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.confirmPassword - Password confirmation
   * @returns {Promise<ApiResponse>} Registration response
   */
  static async register(userData) {
    try {
      // Input validation
      const validation = this.validateRegistrationData(userData);
      if (!validation.isValid) {
        return ApiResponse.error(validation.error);
      }

      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.success) {
        // Auto login after successful registration
        return await this.login({
          email: userData.email,
          password: userData.password,
        });
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return ApiResponse.error("Kayıt olurken bir hata oluştu");
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<ApiResponse>} User profile response
   */
  static async getProfile() {
    try {
      const response = await apiRequest("/users/profile");
      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      return ApiResponse.error("Profil bilgileri alınırken hata oluştu");
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<ApiResponse>} Update response
   */
  static async updateProfile(profileData) {
    try {
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
   * Logout user
   */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  }

  /**
   * Get current user data
   * @returns {Object|null} User data or null
   */
  static getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate registration data
   * @param {Object} data - Registration data
   * @returns {Object} Validation result
   */
  static validateRegistrationData(data) {
    if (
      !data.username ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      return { isValid: false, error: "Tüm alanları doldurun" };
    }

    if (data.username.length < 3 || data.username.length > 20) {
      return {
        isValid: false,
        error: "Kullanıcı adı 3-20 karakter arasında olmalıdır",
      };
    }

    if (!this.isValidEmail(data.email)) {
      return { isValid: false, error: "Geçerli bir email adresi girin" };
    }

    if (data.password.length < 6) {
      return { isValid: false, error: "Şifre en az 6 karakter olmalıdır" };
    }

    if (data.password !== data.confirmPassword) {
      return { isValid: false, error: "Şifreler eşleşmiyor" };
    }

    return { isValid: true };
  }
}

// Export for use in other modules
window.AuthAPI = AuthAPI;

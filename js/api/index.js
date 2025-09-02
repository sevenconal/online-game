// ==========================================
// API CONFIGURATION & UTILITIES
// ==========================================

/**
 * API Base Configuration
 */
const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * API Response Handler
 */
class ApiResponse {
  constructor(success, data = null, error = null, status = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.status = status;
  }

  static success(data, status = HTTP_STATUS.OK) {
    return new ApiResponse(true, data, null, status);
  }

  static error(error, status = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return new ApiResponse(false, null, error, status);
  }
}

/**
 * Generic API Request Function with Error Handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let attempts = 0;
  while (attempts < API_CONFIG.RETRY_ATTEMPTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return ApiResponse.success(data, response.status);
    } catch (error) {
      attempts++;

      if (error.name === "AbortError") {
        if (attempts >= API_CONFIG.RETRY_ATTEMPTS) {
          return ApiResponse.error(
            "Request timeout",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
          );
        }
      } else if (attempts >= API_CONFIG.RETRY_ATTEMPTS) {
        return ApiResponse.error(
          error.message,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Wait before retry
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempts)
      );
    }
  }
}

/**
 * Authentication State Management
 */
class AuthManager {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      this.token = token;
      this.user = JSON.parse(user);
      this.isAuthenticated = true;
    }
  }

  async login(credentials) {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return ApiResponse.success({ user: this.user, token: this.token });
      }

      return response;
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  async register(userData) {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (response.success) {
        return await this.login({
          email: userData.email,
          password: userData.password,
        });
      }

      return response;
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}

// Global Auth Manager Instance
const authManager = new AuthManager();

// Export for use in other modules
window.ApiResponse = ApiResponse;
window.apiRequest = apiRequest;
window.authManager = authManager;
window.API_CONFIG = API_CONFIG;
window.HTTP_STATUS = HTTP_STATUS;

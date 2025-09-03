/**
 * Logger utility for OkeyMobil application
 * Provides structured logging with different levels and error tracking
 */

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
    this.enableConsole = true;
    this.enableStorage = true;
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      CRITICAL: 4,
    };
    this.currentLevel = this.logLevels.DEBUG;
  }

  /**
   * Log a debug message
   */
  debug(message, data = null, context = null) {
    this.log("DEBUG", message, data, context);
  }

  /**
   * Log an info message
   */
  info(message, data = null, context = null) {
    this.log("INFO", message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(message, data = null, context = null) {
    this.log("WARN", message, data, context);
  }

  /**
   * Log an error message
   */
  error(message, data = null, context = null) {
    this.log("ERROR", message, data, context);
    this.handleError(message, data, context);
  }

  /**
   * Log a critical error message
   */
  critical(message, data = null, context = null) {
    this.log("CRITICAL", message, data, context);
    this.handleCriticalError(message, data, context);
  }

  /**
   * Core logging function
   */
  log(level, message, data = null, context = null) {
    if (this.logLevels[level] < this.currentLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
    };

    // Add to internal logs array
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    if (this.enableConsole) {
      const consoleMethod = level.toLowerCase();
      const prefix = `[${timestamp}] [${level}]`;

      if (console[consoleMethod]) {
        console[consoleMethod](`${prefix} ${message}`, data || "");
      } else {
        console.log(`${prefix} ${message}`, data || "");
      }
    }

    // Storage logging
    if (this.enableStorage) {
      this.saveToStorage(logEntry);
    }
  }

  /**
   * Handle error situations
   */
  handleError(message, data, context) {
    // Show user-friendly error notification
    if (window.showNotification) {
      const userMessage = this.getUserFriendlyMessage(message, data);
      window.showNotification(userMessage, "error");
    }

    // Send error to monitoring service (if available)
    this.sendToMonitoring(message, data, context, "error");
  }

  /**
   * Handle critical error situations
   */
  handleCriticalError(message, data, context) {
    // Show critical error notification
    if (window.showNotification) {
      window.showNotification(
        "Kritik bir hata oluştu! Lütfen sayfayı yenileyin.",
        "error"
      );
    }

    // Send critical error to monitoring service
    this.sendToMonitoring(message, data, context, "critical");

    // Optional: Show error modal
    this.showErrorModal(message, data);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(message, data) {
    // Common error patterns and their user-friendly messages
    const errorPatterns = {
      "Network Error": "İnternet bağlantınızda sorun var. Lütfen kontrol edin.",
      "Socket connection failed":
        "Sunucu bağlantısı kesildi. Yeniden bağlanmaya çalışılıyor...",
      "Authentication failed":
        "Giriş bilgileriniz hatalı. Lütfen tekrar deneyin.",
      "Room not found": "Oda bulunamadı. Lütfen başka bir oda deneyin.",
      "Game not found": "Oyun bulunamadı. Lütfen sayfayı yenileyin.",
      "Player limit exceeded": "Oda dolu. Lütfen başka bir masa deneyin.",
      "Invalid move": "Geçersiz hamle. Lütfen tekrar deneyin.",
      "Connection timeout":
        "Bağlantı zaman aşımına uğradı. Yeniden bağlanıyor...",
    };

    // Check for known error patterns
    for (const [pattern, friendlyMessage] of Object.entries(errorPatterns)) {
      if (message.includes(pattern)) {
        return friendlyMessage;
      }
    }

    // Default error message
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
  }

  /**
   * Show error modal for critical errors
   */
  showErrorModal(message, data) {
    const modal = document.createElement("div");
    modal.className = "error-modal";
    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-modal-header">
          <h3>🚨 Kritik Hata</h3>
          <span class="error-modal-close">&times;</span>
        </div>
        <div class="error-modal-body">
          <p>Üzgünüz, beklenmedik bir hata oluştu.</p>
          <p class="error-details">${message}</p>
          <div class="error-actions">
            <button class="btn btn-primary" onclick="window.location.reload()">Sayfayı Yenile</button>
            <button class="btn btn-outline" onclick="this.closest('.error-modal').remove()">Kapat</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector(".error-modal-close");
    closeBtn.onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };
  }

  /**
   * Send error to monitoring service
   */
  sendToMonitoring(message, data, context, level) {
    // This would typically send to a monitoring service like Sentry, LogRocket, etc.
    // For now, we'll just log it
    console.log(`📊 Monitoring: ${level} - ${message}`, { data, context });

    // In a real application, you might send this to:
    // - Sentry: Sentry.captureException(error)
    // - LogRocket: LogRocket.captureException(error)
    // - Custom monitoring endpoint: fetch('/api/errors', { method: 'POST', body: JSON.stringify(logEntry) })
  }

  /**
   * Save log entry to localStorage
   */
  saveToStorage(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem("okeymobil_logs") || "[]");
      logs.push(logEntry);

      // Keep only last 100 logs in storage
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem("okeymobil_logs", JSON.stringify(logs));
    } catch (error) {
      console.warn("Failed to save log to storage:", error);
    }
  }

  /**
   * Get stored logs
   */
  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem("okeymobil_logs") || "[]");
    } catch (error) {
      console.warn("Failed to get stored logs:", error);
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  clearStoredLogs() {
    try {
      localStorage.removeItem("okeymobil_logs");
      this.logs = [];
    } catch (error) {
      console.warn("Failed to clear stored logs:", error);
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  /**
   * Export logs for debugging
   */
  exportLogs() {
    const allLogs = [...this.logs, ...this.getStoredLogs()];
    const dataStr = JSON.stringify(allLogs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `okeymobil_logs_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Set log level
   */
  setLogLevel(level) {
    if (this.logLevels.hasOwnProperty(level)) {
      this.currentLevel = this.logLevels[level];
    }
  }

  /**
   * Enable/disable console logging
   */
  setConsoleLogging(enabled) {
    this.enableConsole = enabled;
  }

  /**
   * Enable/disable storage logging
   */
  setStorageLogging(enabled) {
    this.enableStorage = enabled;
  }
}

// Create global logger instance
window.logger = new Logger();

// Enhanced error handling for uncaught errors
window.addEventListener("error", function (event) {
  window.logger.error(
    "Uncaught error",
    {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    },
    "uncaught"
  );
});

// Enhanced error handling for unhandled promise rejections
window.addEventListener("unhandledrejection", function (event) {
  window.logger.error(
    "Unhandled promise rejection",
    {
      reason: event.reason,
      promise: event.promise,
    },
    "unhandledrejection"
  );
});

// Log application start
window.logger.info(
  "OkeyMobil application started",
  {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  },
  "application"
);

// Export logger for debugging
window.exportLogs = () => window.logger.exportLogs();
window.clearLogs = () => window.logger.clearStoredLogs();
window.getLogs = () => window.logger.getStoredLogs();

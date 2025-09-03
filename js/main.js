// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Update player counts periodically to simulate real-time updates
 */
function updatePlayerCounts() {
  try {
    const statCards = document.querySelectorAll(".stat-card .player-count");
    let totalCount = 0;

    statCards.forEach((card, index) => {
      // Generate a random number between 60 and 400 for demo purposes
      const currentCount = Math.floor(Math.random() * 341) + 60;
      const totalCapacity = 400;
      card.textContent = `${currentCount}/${totalCapacity} Oyuncu`;
      totalCount += currentCount;
    });

    // Update total player count
    const totalPlayerCounts = document.querySelectorAll(
      "h2 span, .total-players span"
    );
    totalPlayerCounts.forEach((span) => {
      span.textContent = totalCount;
    });

    window.logger.debug("Player counts updated successfully", { totalCount });
  } catch (error) {
    window.logger.error(
      "Player counts güncellenirken hata",
      error,
      "updatePlayerCounts"
    );
  }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

/**
 * Initialize modal functionality with enhanced error handling
 */
function initializeModals() {
  try {
    window.logger.info("Initializing modal functionality");

    // Get modal elements with null checks
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const closeLogin = document.getElementById("close-login");
    const closeRegister = document.getElementById("close-register");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");

    // Show login modal
    if (loginBtn && loginModal) {
      loginBtn.addEventListener("click", function () {
        try {
          loginModal.style.display = "flex";
          window.logger.debug("Login modal opened");
        } catch (error) {
          window.logger.error("Login modal açılırken hata", error, "modal");
        }
      });
    } else {
      window.logger.warn("Login modal elements not found", {
        loginBtn: !!loginBtn,
        loginModal: !!loginModal,
      });
    }

    // Show register modal
    if (registerBtn && registerModal) {
      registerBtn.addEventListener("click", function () {
        try {
          registerModal.style.display = "flex";
          window.logger.debug("Register modal opened");
        } catch (error) {
          window.logger.error("Register modal açılırken hata", error, "modal");
        }
      });
    } else {
      window.logger.warn("Register modal elements not found", {
        registerBtn: !!registerBtn,
        registerModal: !!registerModal,
      });
    }

    // Close login modal
    if (closeLogin && loginModal) {
      closeLogin.addEventListener("click", function () {
        try {
          loginModal.style.display = "none";
          window.logger.debug("Login modal closed");
        } catch (error) {
          window.logger.error("Login modal kapanırken hata", error, "modal");
        }
      });
    }

    // Close register modal
    if (closeRegister && registerModal) {
      closeRegister.addEventListener("click", function () {
        try {
          registerModal.style.display = "none";
          window.logger.debug("Register modal closed");
        } catch (error) {
          window.logger.error("Register modal kapanırken hata", error, "modal");
        }
      });
    }

    // Switch to register modal from login
    if (showRegister && loginModal && registerModal) {
      showRegister.addEventListener("click", function (e) {
        try {
          e.preventDefault();
          loginModal.style.display = "none";
          registerModal.style.display = "flex";
          window.logger.debug("Switched to register modal");
        } catch (error) {
          window.logger.error("Modal geçişinde hata", error, "modal");
        }
      });
    }

    // Switch to login modal from register
    if (showLogin && registerModal && loginModal) {
      showLogin.addEventListener("click", function (e) {
        try {
          e.preventDefault();
          registerModal.style.display = "none";
          loginModal.style.display = "flex";
          window.logger.debug("Switched to login modal");
        } catch (error) {
          window.logger.error("Modal geçişinde hata", error, "modal");
        }
      });
    }

    // Close modals when clicking outside
    window.addEventListener("click", function (event) {
      try {
        if (event.target === loginModal) {
          loginModal.style.display = "none";
          window.logger.debug("Login modal closed (outside click)");
        }
        if (event.target === registerModal) {
          registerModal.style.display = "none";
          window.logger.debug("Register modal closed (outside click)");
        }
      } catch (error) {
        window.logger.error("Modal dış tıklama işleminde hata", error, "modal");
      }
    });

    window.logger.info("Modal functionality initialized successfully");
  } catch (error) {
    window.logger.critical(
      "Modal functionality başlatılırken genel hata",
      error,
      "modal"
    );
  }
}

// ==========================================
// FORM VALIDATION
// ==========================================

/**
 * Validate login form with enhanced error handling
 */
function validateLoginForm(username, password) {
  try {
    window.logger.debug("Validating login form", {
      username: !!username,
      password: !!password,
    });

    if (!username || !password) {
      const message = "Lütfen kullanıcı adı ve şifrenizi girin!";
      window.logger.warn("Login validation failed: missing fields", {
        username: !!username,
        password: !!password,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    if (username.length < 3) {
      const message = "Kullanıcı adı en az 3 karakter olmalıdır!";
      window.logger.warn("Login validation failed: username too short", {
        usernameLength: username.length,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    window.logger.info("Login form validation passed");
    return true;
  } catch (error) {
    window.logger.error("Login form validation error", error, "validation");
    return false;
  }
}

/**
 * Validate registration form with enhanced error handling
 */
function validateRegistrationForm(username, email, password, confirmPassword) {
  try {
    window.logger.debug("Validating registration form", {
      username: !!username,
      email: !!email,
      password: !!password,
      confirmPassword: !!confirmPassword,
    });

    if (!username || !email || !password || !confirmPassword) {
      const message = "Lütfen tüm alanları doldurun!";
      window.logger.warn("Registration validation failed: missing fields", {
        username: !!username,
        email: !!email,
        password: !!password,
        confirmPassword: !!confirmPassword,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    if (username.length < 3) {
      const message = "Kullanıcı adı en az 3 karakter olmalıdır!";
      window.logger.warn("Registration validation failed: username too short", {
        usernameLength: username.length,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    if (password.length < 6) {
      const message = "Şifre en az 6 karakter olmalıdır!";
      window.logger.warn("Registration validation failed: password too short", {
        passwordLength: password.length,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    if (password !== confirmPassword) {
      const message = "Şifreler eşleşmiyor!";
      window.logger.warn(
        "Registration validation failed: passwords don't match"
      );
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = "Geçerli bir e-posta adresi girin!";
      window.logger.warn("Registration validation failed: invalid email", {
        email,
      });
      if (window.showNotification) {
        window.showNotification(message, "error");
      } else {
        alert(message);
      }
      return false;
    }

    window.logger.info("Registration form validation passed");
    return true;
  } catch (error) {
    window.logger.error(
      "Registration form validation error",
      error,
      "validation"
    );
    return false;
  }
}

// ==========================================
// UI INTERACTIONS
// ==========================================

/**
 * Initialize UI interactions with enhanced error handling
 */
function initializeUIInteractions() {
  try {
    window.logger.info("Initializing UI interactions");

    // Add hover effects to room cards
    const roomCards = document.querySelectorAll(".room-card");
    window.logger.debug("Found room cards", { count: roomCards.length });

    roomCards.forEach((card, index) => {
      card.addEventListener("mouseenter", function () {
        try {
          this.style.transform = "translateY(-5px)";
        } catch (error) {
          window.logger.error("Room card hover effect hatası", error, "ui");
        }
      });

      card.addEventListener("mouseleave", function () {
        try {
          this.style.transform = "translateY(0)";
        } catch (error) {
          window.logger.error("Room card leave effect hatası", error, "ui");
        }
      });
    });

    // Add hover effects to game tables
    const gameTables = document.querySelectorAll(".game-table");
    window.logger.debug("Found game tables", { count: gameTables.length });

    gameTables.forEach((table, index) => {
      table.addEventListener("mouseenter", function () {
        try {
          this.style.transform = "translateY(-5px)";
        } catch (error) {
          window.logger.error("Game table hover effect hatası", error, "ui");
        }
      });

      table.addEventListener("mouseleave", function () {
        try {
          this.style.transform = "translateY(0)";
        } catch (error) {
          window.logger.error("Game table leave effect hatası", error, "ui");
        }
      });
    });

    // Add click effects to quick links
    const quickLinks = document.querySelectorAll(".quick-link");
    window.logger.debug("Found quick links", { count: quickLinks.length });

    quickLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        try {
          e.preventDefault();

          // Küçük animasyon
          link.style.transform = "translateY(-3px)";
          const targetUrl = link.getAttribute("href");

          setTimeout(() => {
            link.style.transform = "translateY(0)";
            if (targetUrl && targetUrl !== "#") {
              window.logger.info("Navigating to URL", { targetUrl });
              window.location.href = targetUrl; // yönlendirmeyi yap
            } else {
              window.logger.debug("Quick link clicked (no navigation)", {
                targetUrl,
              });
            }
          }, 300);
        } catch (error) {
          window.logger.error("Quick link click effect hatası", error, "ui");
        }
      });
    });

    // Add click effects to game table buttons
    const playButtons = document.querySelectorAll(".btn-play");
    window.logger.debug("Found play buttons", { count: playButtons.length });

    playButtons.forEach((button) => {
      button.addEventListener("click", function () {
        try {
          const tableElement = this.closest(".game-table");
          const tableId = tableElement
            ? tableElement.getAttribute("data-table-id")
            : null;

          if (this.classList.contains("disabled")) {
            window.logger.warn("Attempted to play on disabled table", {
              tableId,
            });
            if (window.showNotification) {
              window.showNotification(
                "Bu masa şu anda kullanılamıyor.",
                "error"
              );
            }
            return;
          }

          window.logger.info("Play button clicked", { tableId });
          // Here you would typically join the game
          if (window.showNotification) {
            window.showNotification("Oyuna katılınıyor...", "info");
          }
        } catch (error) {
          window.logger.error("Play button click error", error, "ui");
        }
      });
    });

    window.logger.info("UI interactions initialized successfully");
  } catch (error) {
    window.logger.critical(
      "UI interactions initialization hatası",
      error,
      "ui"
    );
  }
}

// ==========================================
// CHAT SYSTEM
// ==========================================

/**
 * Initialize chat system
 */
function initializeChatSystem() {
  try {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      // Add new messages periodically
      setInterval(() => {
        try {
          const messages = [
            "Oyuna başlayalım mı?",
            "Kimler oynamak istiyor?",
            "Bugün şanslı hissediyorum",
            "Yeni turnuva ne zaman?",
            "Gold üyelik avantajları neler?",
          ];

          const users = ["Oyuncu4", "Oyuncu5", "Oyuncu6", "Oyuncu7", "Oyuncu8"];

          const randomMessage =
            messages[Math.floor(Math.random() * messages.length)];
          const randomUser = users[Math.floor(Math.random() * users.length)];

          const newMessage = document.createElement("div");
          newMessage.className = "message";
          newMessage.innerHTML = `<span class="user">${randomUser}:</span> <span class="text">${randomMessage}</span>`;

          chatMessages.appendChild(newMessage);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // Remove oldest message if there are too many
          if (chatMessages.children.length > 20) {
            chatMessages.removeChild(chatMessages.firstChild);
          }
        } catch (error) {
          console.error("Chat message animation hatası:", error);
        }
      }, 8000);
    }
  } catch (error) {
    console.error("Chat system initialization hatası:", error);
  }
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

/**
 * Initialize notification system
 */
function initializeNotificationSystem() {
  try {
    const notificationBar = document.querySelector(".notification-bar");
    if (notificationBar) {
      setInterval(() => {
        try {
          const notifications = [
            "Yeni Gold üyelik avantajları! Hemen inceleyin.",
            "Haftanın turnuvası bugün başlıyor!",
            "Okey 101 odasında büyük ödül seni bekliyor!",
            "Arkadaşını davet et, ikisiniz de ödül kazanın!",
          ];

          const randomNotification =
            notifications[Math.floor(Math.random() * notifications.length)];
          const notificationSpan = document.querySelector(
            ".notification-bar span"
          );
          if (notificationSpan) {
            notificationSpan.textContent = randomNotification;
          }
        } catch (error) {
          console.error("Notification bar animation hatası:", error);
        }
      }, 15000);
    }
  } catch (error) {
    console.error("Notification system initialization hatası:", error);
  }
}

// ==========================================
// NAVIGATION
// ==========================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  try {
    const quickPlayBtn = document.getElementById("quick-play-btn");
    if (quickPlayBtn) {
      quickPlayBtn.addEventListener("click", function () {
        try {
          // Salon sayfaları
          const salons = [
            "okey-salonlari.html",
            "batak-salonlari.html",
            "tavla-salonlari.html",
            "pisti-salonlari.html",
          ];

          // Rastgele bir salon seç
          const randomSalon = salons[Math.floor(Math.random() * salons.length)];

          // Seçilen salona yönlendir
          if (randomSalon && typeof window !== "undefined") {
            window.location.href = randomSalon;
          } else {
            console.error("Salon seçimi veya yönlendirme hatası");
            alert("Salon yüklenirken bir hata oluştu!");
          }
        } catch (error) {
          console.error("Quick play functionality hatası:", error);
          alert("Hızlı oynama özelliği çalışırken bir hata oluştu!");
        }
      });
    }
  } catch (error) {
    console.error("Navigation initialization hatası:", error);
  }
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

/**
 * Main application initialization
 */
document.addEventListener("DOMContentLoaded", function () {
  try {
    // Load API modules
    loadAPIScripts();

    // Initialize all modules after API scripts are loaded
    setTimeout(() => {
      initializeModals();
      initializeUIInteractions();
      initializeChatSystem();
      initializeNotificationSystem();
      initializeNavigation();

      // Initialize player counts
      updatePlayerCounts();
      setInterval(updatePlayerCounts, 5000);

      // Start performance monitoring
      startPerformanceMonitoring();

      // Run tests in development mode
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        setTimeout(runApplicationTests, 2000);
      }

      window.logger.info("🚀 OkeyMobil application initialized successfully");
    }, 100);
  } catch (error) {
    console.error("Uygulama başlatılırken genel hata:", error);
  }
});

/**
 * Load API scripts dynamically
 */
function loadAPIScripts() {
  const scripts = [
    "js/api/index.js",
    "js/api/auth.js",
    "js/api/rooms.js",
    "js/api/users.js",
  ];

  scripts.forEach((scriptPath) => {
    const script = document.createElement("script");
    script.src = scriptPath;
    script.defer = true;
    document.head.appendChild(script);
  });
}

// ==========================================
// FORM HANDLERS WITH API INTEGRATION
// ==========================================

/**
 * Initialize form handlers after API scripts are loaded
 */
function initializeFormHandlers() {
  // Login form submission with API integration
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      try {
        e.preventDefault();

        const email = document.getElementById("username")?.value; // Using username field for email
        const password = document.getElementById("password")?.value;

        // Basic validation
        if (!email || !password) {
          alert("Lütfen email ve şifrenizi girin!");
          return;
        }

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Giriş yapılıyor...";
        submitBtn.disabled = true;

        // API call
        const response = await AuthAPI.login({ email, password });

        if (response.success) {
          alert("Giriş başarılı! Hoş geldiniz!");
          const loginModal = document.getElementById("login-modal");
          if (loginModal) {
            loginModal.style.display = "none";
          }
          // Refresh page to update UI with logged in state
          window.location.reload();
        } else {
          alert(response.error || "Giriş başarısız!");
        }

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      } catch (error) {
        console.error("Login form submission hatası:", error);
        alert("Giriş işlemi sırasında bir hata oluştu!");
      }
    });
  }

  // Register form submission with API integration
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      try {
        e.preventDefault();

        const username = document.getElementById("reg-username")?.value;
        const email = document.getElementById("reg-email")?.value;
        const password = document.getElementById("reg-password")?.value;
        const confirmPassword = document.getElementById(
          "reg-password-confirm"
        )?.value;

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
          alert("Lütfen tüm alanları doldurun!");
          return;
        }

        if (password !== confirmPassword) {
          alert("Şifreler eşleşmiyor!");
          return;
        }

        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Kayıt ediliyor...";
        submitBtn.disabled = true;

        // API call
        const response = await AuthAPI.register({
          username,
          email,
          password,
          confirmPassword,
        });

        if (response.success) {
          alert("Kayıt başarılı! Otomatik giriş yapılıyor...");
          const registerModal = document.getElementById("register-modal");
          if (registerModal) {
            registerModal.style.display = "none";
          }
          // Page will reload after successful login
        } else {
          alert(response.error || "Kayıt başarısız!");
        }

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      } catch (error) {
        console.error("Register form submission hatası:", error);
        alert("Kayıt işlemi sırasında bir hata oluştu!");
      }
    });
  }
}

// Initialize form handlers after API scripts are loaded
setTimeout(() => {
  initializeFormHandlers();
}, 200);

// ==========================================
// SOCKET.IO INTEGRATION
// ==========================================

/**
 * Initialize Socket.io connection
 */
function initializeSocketConnection() {
  try {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    console.log("🔑 Token kontrol ediliyor...");

    if (!token) {
      console.log("🔌 No token found, skipping socket connection");
      return;
    }

    if (window.socketManager) {
      const socketManager = window.socketManager;

      // Connect to socket server
      const socket = socketManager.connect(token);

      if (socket) {
        // Setup socket event listeners
        setupSocketEventListeners(socketManager);
        console.log("✅ Socket.io bağlantısı kuruldu");

        // Test connection after 2 seconds
        setTimeout(() => {
          const status = socketManager.getStatus();
          console.log("📊 Bağlantı durumu:", status);
        }, 2000);
      } else {
        console.error("❌ Socket bağlantısı kurulamadı");
      }
    } else {
      console.error("❌ Socket manager bulunamadı");
    }
  } catch (error) {
    console.error("Socket initialization error:", error);
  }
}

/**
 * Setup socket event listeners
 */
function setupSocketEventListeners(socketManager) {
  // Connection status
  socketManager.on("connection-status", (data) => {
    updateConnectionStatus(data);
  });

  // Room events
  socketManager.on("room-joined", (data) => {
    console.log("✅ Odaya katıldınız:", data.roomId);
    updateRoomUI(data);
  });

  socketManager.on("user-joined-room", (data) => {
    addUserToRoom(data);
  });

  socketManager.on("user-left-room", (data) => {
    removeUserFromRoom(data);
  });

  // Chat events
  socketManager.on("new-chat-message", (data) => {
    addMessageToChat(data);
  });

  socketManager.on("user-typing", (data) => {
    handleTypingIndicator(data);
  });

  // User presence events
  socketManager.on("user-online", (data) => {
    updateUserPresence(data, "online");
  });

  socketManager.on("user-offline", (data) => {
    updateUserPresence(data, "offline");
  });

  socketManager.on("online-users", (data) => {
    updateOnlineUsersList(data.users);
  });

  // Game state events
  socketManager.on("game-state-update", (data) => {
    updateGameState(data);
  });

  socketManager.on("game-started", (data) => {
    handleGameStart(data);
  });

  socketManager.on("game-ended", (data) => {
    handleGameEnd(data);
  });

  socketManager.on("player-joined-game", (data) => {
    handlePlayerJoinedGame(data);
  });

  socketManager.on("player-left-game", (data) => {
    handlePlayerLeftGame(data);
  });

  socketManager.on("table-status-changed", (data) => {
    handleTableStatusChanged(data);
  });

  // Game events
  socketManager.on("game-state-update", (data) => {
    console.log("🎮 Game state update:", data);
    updateGameState(data);
  });

  socketManager.on("game-started", (data) => {
    console.log("🎯 Game started:", data);
    handleGameStart(data);
  });

  socketManager.on("game-ended", (data) => {
    console.log("🏁 Game ended:", data);
    handleGameEnd(data);
  });

  // Error handling
  socketManager.on("socket-error", (error) => {
    console.error("🔌 Socket error:", error);
    handleSocketError(error);
  });

  socketManager.on("connection-error", (error) => {
    console.error("🔌 Connection error:", error);
    handleConnectionError(error);
  });
}

/**
 * Update connection status in UI
 */
function updateConnectionStatus(data) {
  try {
    // Update connection indicator
    const connectionIndicator = document.getElementById("connection-status");
    if (connectionIndicator) {
      connectionIndicator.className =
        data.status === "connected" ? "connected" : "disconnected";
      connectionIndicator.textContent =
        data.status === "connected" ? "🟢 Çevrimiçi" : "🔴 Çevrimdışı";
    }

    // Show notification
    if (data.status === "connected") {
      showNotification("Sunucuya bağlandınız!", "success");
    } else if (data.status === "disconnected") {
      showNotification("Sunucu bağlantısı kesildi!", "error");
    }
  } catch (error) {
    console.error("Connection status update error:", error);
  }
}

/**
 * Update room UI when joined
 */
function updateRoomUI(data) {
  try {
    // Update current room display
    const roomDisplay = document.getElementById("current-room");
    if (roomDisplay) {
      roomDisplay.textContent = `Oda: ${data.roomId}`;
    }

    // Enable room-specific features
    enableRoomFeatures(data.roomId);
  } catch (error) {
    console.error("Room UI update error:", error);
  }
}

/**
 * Add user to room display
 */
function addUserToRoom(data) {
  try {
    // Update user list in room
    const userList = document.getElementById("room-users");
    if (userList) {
      const userItem = document.createElement("li");
      userItem.className = "user-item online";
      userItem.innerHTML = `
        <span class="status-indicator"></span>
        <span class="user-name">${data.username}</span>
        <span class="user-status">Odada</span>
      `;
      userList.appendChild(userItem);
    }

    // Show notification
    showNotification(`${data.username} odaya katıldı!`, "info");
  } catch (error) {
    console.error("Add user to room error:", error);
  }
}

/**
 * Remove user from room display
 */
function removeUserFromRoom(data) {
  try {
    // Remove user from list
    const userList = document.getElementById("room-users");
    if (userList) {
      const userItems = userList.querySelectorAll(".user-item");
      userItems.forEach((item) => {
        const userName = item.querySelector(".user-name");
        if (userName && userName.textContent === data.username) {
          item.remove();
        }
      });
    }

    // Show notification
    showNotification(`${data.username} odadan ayrıldı!`, "info");
  } catch (error) {
    console.error("Remove user from room error:", error);
  }
}

/**
 * Add message to chat
 */
function addMessageToChat(data) {
  try {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      const newMessage = document.createElement("div");
      newMessage.className = "message";

      // Format timestamp
      const timestamp = new Date(data.timestamp);
      const timeString = timestamp.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      newMessage.innerHTML = `
        <div class="message-header">
          <span class="user">${data.username || data.userId}</span>
          <span class="timestamp">${timeString}</span>
        </div>
        <span class="text">${data.message}</span>
      `;

      chatMessages.appendChild(newMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Add visual feedback for new messages
      newMessage.style.animation = "fadeIn 0.3s ease-in";

      // Remove old messages if too many (keep last 100)
      if (chatMessages.children.length > 100) {
        chatMessages.removeChild(chatMessages.firstChild);
      }

      // Show notification for new messages
      if (document.hidden) {
        showNotification(`Yeni mesaj: ${data.username}`, "info");
      }
    }
  } catch (error) {
    console.error("Add message to chat error:", error);
  }
}

/**
 * Update game state
 */
function updateGameState(data) {
  try {
    // Update game board
    // Update player positions
    // Update scores
    console.log("Game state updated:", data);
  } catch (error) {
    console.error("Game state update error:", error);
  }
}

/**
 * Handle game start
 */
function handleGameStart(data) {
  try {
    showNotification("Oyun başladı!", "success");
    // Enable game controls
    // Start game timer
    // Update UI for active game
  } catch (error) {
    console.error("Game start handler error:", error);
  }
}

/**
 * Handle game end
 */
function handleGameEnd(data) {
  try {
    showNotification("Oyun bitti!", "info");
    // Show final scores
    // Update player stats
    // Reset game board
  } catch (error) {
    console.error("Game end handler error:", error);
  }
}

/**
 * Handle socket errors
 */
function handleSocketError(error) {
  try {
    showNotification("Bağlantı hatası: " + error.message, "error");
  } catch (err) {
    console.error("Socket error handler error:", err);
  }
}

/**
 * Handle connection errors
 */
function handleConnectionError(error) {
  try {
    showNotification("Bağlantı kurulamadı!", "error");
    // Retry connection after delay
    setTimeout(() => {
      initializeSocketConnection();
    }, 5000);
  } catch (err) {
    console.error("Connection error handler error:", err);
  }
}

/**
 * Enable room-specific features
 */
function enableRoomFeatures(roomId) {
  try {
    // Check socket connection
    if (
      !window.socketManager ||
      !window.socketManager.getStatus().isConnected
    ) {
      showNotification("Socket bağlantısı yok!", "error");
      return;
    }

    // Join room automatically
    const joinSuccess = window.socketManager.joinRoom(roomId);
    if (!joinSuccess) {
      showNotification("Odaya katılamadı!", "error");
      return;
    }

    // Enable chat input
    const chatInput = document.getElementById("chat-input");
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.placeholder = "Mesajınızı yazın...";
    }

    // Enable send button
    const sendButton = document.getElementById("send-message-btn");
    if (sendButton) {
      sendButton.disabled = false;
    }

    // Add chat message handler
    if (chatInput && sendButton) {
      const sendMessage = () => {
        sendChatMessage();
      };

      // Remove existing listeners to prevent duplicates
      sendButton.removeEventListener("click", sendMessage);
      chatInput.removeEventListener("keypress", sendMessage);

      sendButton.addEventListener("click", sendMessage);
      chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      });
    }

    // Initialize typing indicators
    initializeTypingIndicators();

    // Show success notification
    showNotification(`${roomId} odasına katıldınız!`, "success");
  } catch (error) {
    console.error("Oda özellikleri hatası:", error);
    showNotification("Oda özellikleri etkinleştirilemedi!", "error");
  }
}

/**
 * Handle typing indicators
 */
function handleTypingIndicator(data) {
  try {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      if (data.isTyping) {
        typingIndicator.textContent = `${data.username} yazıyor...`;
        typingIndicator.style.display = "block";
      } else {
        typingIndicator.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Typing indicator error:", error);
  }
}

/**
 * Send chat message
 */
function sendChatMessage() {
  try {
    const chatInput = document.getElementById("chat-input");
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // Check if socket is connected
    if (
      !window.socketManager ||
      !window.socketManager.getStatus().isConnected
    ) {
      showNotification("Socket bağlantısı yok!", "error");
      return;
    }

    // Send message via socket
    const success = window.socketManager.sendMessage(message);
    if (success) {
      chatInput.value = "";
      console.log("💬 Message sent:", message);
    } else {
      showNotification("Mesaj gönderilemedi!", "error");
    }
  } catch (error) {
    console.error("Send chat message error:", error);
    showNotification("Mesaj gönderme hatası!", "error");
  }
}

/**
 * Initialize typing indicators
 */
function initializeTypingIndicators() {
  try {
    const chatInput = document.getElementById("chat-input");
    if (!chatInput) return;

    let typingTimeout;

    chatInput.addEventListener("input", () => {
      if (
        !window.socketManager ||
        !window.socketManager.getStatus().isConnected
      )
        return;

      // Clear previous timeout
      clearTimeout(typingTimeout);

      // Send typing start
      if (window.socketManager.socket) {
        window.socketManager.socket.emit("typing-start", {
          roomId: window.socketManager.getStatus().currentRoom,
        });
      }

      // Send typing stop after 1 second of no input
      typingTimeout = setTimeout(() => {
        if (window.socketManager.socket) {
          window.socketManager.socket.emit("typing-stop", {
            roomId: window.socketManager.getStatus().currentRoom,
          });
        }
      }, 1000);
    });

    // Send typing stop when input loses focus
    chatInput.addEventListener("blur", () => {
      if (window.socketManager.socket) {
        window.socketManager.socket.emit("typing-stop", {
          roomId: window.socketManager.getStatus().currentRoom,
        });
      }
    });
  } catch (error) {
    console.error("Initialize typing indicators error:", error);
  }
}

/**
 * Update user presence status
 */
function updateUserPresence(data, status) {
  try {
    // Update user in online users list
    const userList = document.getElementById("online-users-list");
    if (userList) {
      const userItems = userList.querySelectorAll(".user-item");
      userItems.forEach((item) => {
        const userName = item.querySelector(".user-name");
        if (userName && userName.textContent === data.username) {
          item.className = `user-item ${status}`;
          const statusIndicator = item.querySelector(".status-indicator");
          if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
          }
        }
      });
    }

    // Update friends list if exists
    const friendsList = document.querySelector(".friends-list");
    if (friendsList) {
      const friendItems = friendsList.querySelectorAll(".friend");
      friendItems.forEach((item) => {
        const friendName = item.querySelector(".friend-name");
        if (friendName && friendName.textContent === data.username) {
          item.className = `friend ${status}`;
          const statusIndicator = item.querySelector(".status-indicator");
          if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
          }
        }
      });
    }

    // Show notification
    const statusText =
      status === "online" ? "çevrimiçi oldu" : "çevrimdışı oldu";
    showNotification(`${data.username} ${statusText}`, "info");
  } catch (error) {
    console.error("Update user presence error:", error);
  }
}

/**
 * Update online users list
 */
function updateOnlineUsersList(users) {
  try {
    const userList = document.getElementById("online-users-list");
    if (userList) {
      // Clear existing list
      userList.innerHTML = "";

      // Add each online user
      users.forEach((user) => {
        const userItem = document.createElement("li");
        userItem.className = "user-item online";
        userItem.innerHTML = `
          <span class="status-indicator online"></span>
          <span class="user-name">${user.username}</span>
          <span class="user-status">${
            user.currentRoom ? user.currentRoom + " odasında" : "Lobide"
          }</span>
        `;
        userList.appendChild(userItem);
      });

      // Update online users count
      const countElement = document.getElementById("online-users-count");
      if (countElement) {
        countElement.textContent = users.length;
      }
    }
  } catch (error) {
    console.error("Update online users list error:", error);
  }
}

/**
 * Update game state
 */
function updateGameState(data) {
  try {
    console.log("🎮 Updating game state:", data);

    // Update table status
    if (data.tableId) {
      updateTableStatus(data.tableId, data);
    }

    // Update player positions
    if (data.players) {
      updatePlayerPositions(data.tableId, data.players);
    }

    // Update game score
    if (data.score !== undefined) {
      updateGameScore(data.tableId, data.score);
    }

    // Update game timer
    if (data.timeLeft !== undefined) {
      updateGameTimer(data.tableId, data.timeLeft);
    }
  } catch (error) {
    console.error("Update game state error:", error);
  }
}

/**
 * Handle game start
 */
function handleGameStart(data) {
  try {
    console.log("🎯 Game started:", data);

    // Update table status to "playing"
    updateTableStatus(data.tableId, { status: "playing", gameStarted: true });

    // Show notification
    showNotification(`Masa ${data.tableId} oyun başladı!`, "success");

    // Update UI elements
    const tableElement = document.querySelector(
      `[data-table-id="${data.tableId}"]`
    );
    if (tableElement) {
      tableElement.classList.add("playing");
      tableElement.classList.remove("waiting");
    }
  } catch (error) {
    console.error("Handle game start error:", error);
  }
}

/**
 * Handle game end
 */
function handleGameEnd(data) {
  try {
    console.log("🏁 Game ended:", data);

    // Update table status to "finished"
    updateTableStatus(data.tableId, {
      status: "finished",
      gameEnded: true,
      winner: data.winner,
    });

    // Show notification
    const winnerText = data.winner ? `${data.winner} kazandı!` : "Oyun bitti!";
    showNotification(`Masa ${data.tableId}: ${winnerText}`, "info");

    // Update UI elements
    const tableElement = document.querySelector(
      `[data-table-id="${data.tableId}"]`
    );
    if (tableElement) {
      tableElement.classList.remove("playing");
      tableElement.classList.add("finished");
    }

    // Reset after 5 seconds
    setTimeout(() => {
      if (tableElement) {
        tableElement.classList.remove("finished");
        tableElement.classList.add("waiting");
      }
    }, 5000);
  } catch (error) {
    console.error("Handle game end error:", error);
  }
}

/**
 * Handle player joined game
 */
function handlePlayerJoinedGame(data) {
  try {
    console.log("👤 Player joined game:", data);

    // Update player position in table
    updatePlayerInTable(data.tableId, data.player, "joined");

    // Show notification
    showNotification(`${data.player.username} masaya katıldı!`, "info");
  } catch (error) {
    console.error("Handle player joined game error:", error);
  }
}

/**
 * Handle player left game
 */
function handlePlayerLeftGame(data) {
  try {
    console.log("👋 Player left game:", data);

    // Update player position in table
    updatePlayerInTable(data.tableId, data.player, "left");

    // Show notification
    showNotification(`${data.player.username} masadan ayrıldı!`, "info");
  } catch (error) {
    console.error("Handle player left game error:", error);
  }
}

/**
 * Handle table status changed
 */
function handleTableStatusChanged(data) {
  try {
    console.log("📊 Table status changed:", data);

    updateTableStatus(data.tableId, data);

    // Update UI based on status
    const tableElement = document.querySelector(
      `[data-table-id="${data.tableId}"]`
    );
    if (tableElement) {
      // Remove all status classes
      tableElement.classList.remove(
        "waiting",
        "playing",
        "finished",
        "full",
        "empty"
      );

      // Add new status class
      if (data.status) {
        tableElement.classList.add(data.status);
      }
    }
  } catch (error) {
    console.error("Handle table status changed error:", error);
  }
}

/**
 * Update table status
 */
function updateTableStatus(tableId, data) {
  try {
    const tableElement = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableElement) return;

    // Update status indicators
    const indicators = tableElement.querySelector(".table-indicators");
    if (indicators && data.status) {
      // Update status indicator
      const statusIndicator = indicators.querySelector(".indicator.status");
      if (statusIndicator) {
        let statusText = "Başlamadı";
        if (data.status === "playing") statusText = "Oyun Başladı";
        else if (data.status === "finished") statusText = "Oyun Bitti";
        else if (data.status === "waiting") statusText = "Oyuncu Bekleniyor";

        statusIndicator.textContent = statusText;
      }
    }

    // Update player count
    if (data.playerCount !== undefined) {
      const playerCountElement = tableElement.querySelector(".player-count");
      if (playerCountElement) {
        playerCountElement.textContent = `${data.playerCount}/4 Oyuncu`;
      }
    }

    // Update score
    if (data.score !== undefined) {
      const scoreElement = tableElement.querySelector(".table-score");
      if (scoreElement) {
        scoreElement.textContent = `Puan: ${data.score}`;
      }
    }
  } catch (error) {
    console.error("Update table status error:", error);
  }
}

/**
 * Update player positions in table
 */
function updatePlayerPositions(tableId, players) {
  try {
    const tableElement = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableElement) return;

    const playerElements = tableElement.querySelectorAll(".player");

    players.forEach((player, index) => {
      if (playerElements[index]) {
        const playerElement = playerElements[index];
        const avatarElement = playerElement.querySelector(".player-avatar");
        const nameElement = playerElement.querySelector(".player-name");

        if (avatarElement) {
          avatarElement.textContent = player.avatar || "👤";
        }

        if (nameElement) {
          nameElement.textContent = player.username || "Boş";
          nameElement.classList.toggle("empty", !player.username);
        }

        playerElement.classList.toggle("empty", !player.username);
      }
    });
  } catch (error) {
    console.error("Update player positions error:", error);
  }
}

/**
 * Update player in table
 */
function updatePlayerInTable(tableId, player, action) {
  try {
    const tableElement = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableElement) return;

    // Find empty player slot or update existing
    const playerElements = tableElement.querySelectorAll(".player");

    if (action === "joined") {
      // Find empty slot
      const emptySlot = Array.from(playerElements).find((el) =>
        el.classList.contains("empty")
      );
      if (emptySlot) {
        const avatarElement = emptySlot.querySelector(".player-avatar");
        const nameElement = emptySlot.querySelector(".player-name");

        if (avatarElement) avatarElement.textContent = player.avatar || "👤";
        if (nameElement) {
          nameElement.textContent = player.username;
          nameElement.classList.remove("empty");
        }
        emptySlot.classList.remove("empty");
      }
    } else if (action === "left") {
      // Find player slot and empty it
      playerElements.forEach((playerElement) => {
        const nameElement = playerElement.querySelector(".player-name");
        if (nameElement && nameElement.textContent === player.username) {
          const avatarElement = playerElement.querySelector(".player-avatar");

          if (avatarElement) avatarElement.textContent = "👤";
          if (nameElement) {
            nameElement.textContent = "Boş";
            nameElement.classList.add("empty");
          }
          playerElement.classList.add("empty");
        }
      });
    }
  } catch (error) {
    console.error("Update player in table error:", error);
  }
}

/**
 * Update game score
 */
function updateGameScore(tableId, score) {
  try {
    const tableElement = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableElement) return;

    const scoreElement = tableElement.querySelector(".table-score");
    if (scoreElement) {
      scoreElement.textContent = `Puan: ${score}`;
    }
  } catch (error) {
    console.error("Update game score error:", error);
  }
}

/**
 * Update game timer
 */
function updateGameTimer(tableId, timeLeft) {
  try {
    const tableElement = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableElement) return;

    // Create or update timer element
    let timerElement = tableElement.querySelector(".game-timer");
    if (!timerElement) {
      timerElement = document.createElement("div");
      timerElement.className = "game-timer";
      tableElement.appendChild(timerElement);
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `⏱️ ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Add warning class if time is low
    timerElement.classList.toggle("warning", timeLeft < 60);
  } catch (error) {
    console.error("Update game timer error:", error);
  }
}

/**
 * Test user presence system
 */
function testUserPresence() {
  console.log("🧪 Testing User Presence System...");

  // Check socket connection
  if (window.socketManager) {
    const status = window.socketManager.getStatus();
    console.log("📊 Socket Status:", status);

    if (status.isConnected) {
      console.log("✅ Socket connected, testing user presence...");

      // Test user online
      setTimeout(() => {
        console.log("🟢 Simulating user online...");
        updateUserPresence(
          { username: "TestUser", currentRoom: "okey-salonu" },
          "online"
        );
      }, 1000);

      // Test user offline
      setTimeout(() => {
        console.log("🔴 Simulating user offline...");
        updateUserPresence(
          { username: "TestUser", currentRoom: null },
          "offline"
        );
      }, 3000);

      // Test online users list
      setTimeout(() => {
        console.log("👥 Simulating online users list...");
        updateOnlineUsersList([
          { username: "Player1", currentRoom: "okey-salonu" },
          { username: "Player2", currentRoom: "batak-salonu" },
          { username: "Player3", currentRoom: null },
        ]);
      }, 5000);
    } else {
      console.log("❌ Socket not connected");
    }
  } else {
    console.log("❌ Socket manager not found");
  }
}

/**
 * Test game state synchronization with detailed logging and manual control
 */
function testGameState() {
  console.log("🎮 === GAME STATE SYNCHRONIZATION TEST BAŞLIYOR ===");

  if (window.socketManager) {
    const status = window.socketManager.getStatus();
    console.log("📊 Socket Status:", status);

    if (status.isConnected) {
      console.log("✅ Socket bağlantısı aktif, test başlatılıyor...");
      console.log("⏳ 3 saniye sonra oyun başlatma testi başlayacak...");

      // Test game start - 3 saniye sonra
      setTimeout(() => {
        console.log("\n🎯 === ADIM 1: OYUN BAŞLATMA TESTİ ===");
        console.log("📝 Test: Masa 3897'de oyun başlatılıyor...");
        handleGameStart({ tableId: "3897" });
        console.log("✅ Oyun başlatma testi tamamlandı");
        console.log("⏳ 3 saniye sonra oyuncu katılım testi başlayacak...");
      }, 3000);

      // Test player joined - 6 saniye sonra
      setTimeout(() => {
        console.log("\n👤 === ADIM 2: OYUNCU KATILIM TESTİ ===");
        console.log("📝 Test: NewPlayer masaya katılıyor...");
        handlePlayerJoinedGame({
          tableId: "3897",
          player: { username: "NewPlayer", avatar: "🎮" },
        });
        console.log("✅ Oyuncu katılım testi tamamlandı");
        console.log(
          "⏳ 3 saniye sonra oyun durumu güncelleme testi başlayacak..."
        );
      }, 6000);

      // Test game state update - 9 saniye sonra
      setTimeout(() => {
        console.log("\n📊 === ADIM 3: OYUN DURUMU GÜNCELLEME TESTİ ===");
        console.log(
          "📝 Test: Masa durumu güncelleniyor (puan, süre, oyuncular)..."
        );
        updateGameState({
          tableId: "3897",
          score: 1250,
          timeLeft: 180,
          players: [
            { username: "Player1", avatar: "👤" },
            { username: "Player2", avatar: "👤" },
            { username: "NewPlayer", avatar: "🎮" },
            { username: "Player4", avatar: "👤" },
          ],
        });
        console.log("✅ Oyun durumu güncelleme testi tamamlandı");
        console.log("⏳ 3 saniye sonra oyun bitiş testi başlayacak...");
      }, 9000);

      // Test game end - 12 saniye sonra
      setTimeout(() => {
        console.log("\n🏁 === ADIM 4: OYUN BİTİŞ TESTİ ===");
        console.log("📝 Test: Oyun bitiriliyor, kazanan belirleniyor...");
        handleGameEnd({ tableId: "3897", winner: "Player1" });
        console.log("✅ Oyun bitiş testi tamamlandı");
        console.log("\n🎉 === TÜM TESTLER TAMAMLANDI ===");
        console.log("📋 Test sonuçlarını kontrol edin:");
        console.log("   - Masa 3897 durumu değişti mi?");
        console.log("   - Notification'lar göründü mü?");
        console.log("   - Oyuncu pozisyonları güncellendi mi?");
        console.log("   - Puan ve süre gösterildi mi?");
      }, 12000);
    } else {
      console.log("❌ Socket bağlantısı yok - test başlatılamadı");
      console.log("💡 Önce socket bağlantısını kontrol edin");
    }
  } else {
    console.log("❌ Socket manager bulunamadı");
    console.log("💡 Socket.io kütüphanesi yüklenmemiş olabilir");
  }
}

/**
 * Test individual game state functions
 */
function testGameFunction(functionName) {
  console.log(`🧪 Testing individual function: ${functionName}`);

  switch (functionName) {
    case "gameStart":
      console.log("🎯 Testing game start...");
      handleGameStart({ tableId: "3897" });
      break;

    case "playerJoin":
      console.log("👤 Testing player join...");
      handlePlayerJoinedGame({
        tableId: "3897",
        player: { username: "TestPlayer", avatar: "🎮" },
      });
      break;

    case "gameUpdate":
      console.log("📊 Testing game update...");
      updateGameState({
        tableId: "3897",
        score: 750,
        timeLeft: 120,
      });
      break;

    case "gameEnd":
      console.log("🏁 Testing game end...");
      handleGameEnd({ tableId: "3897", winner: "TestPlayer" });
      break;

    default:
      console.log("❌ Unknown function name");
  }
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
  try {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  } catch (error) {
    console.error("Show notification error:", error);
  }
}

// ==========================================
// TESTING AND DEBUGGING FUNCTIONS
// ==========================================

/**
 * Run comprehensive tests for the application
 */
function runApplicationTests() {
  try {
    window.logger.info("🧪 Starting application tests");

    // Test logger functionality
    testLogger();

    // Test modal functionality
    testModals();

    // Test UI interactions
    testUIInteractions();

    // Test socket connection (if available)
    testSocketConnection();

    window.logger.info("✅ Application tests completed");
  } catch (error) {
    window.logger.critical("Application tests failed", error, "test");
  }
}

/**
 * Test logger functionality
 */
function testLogger() {
  try {
    window.logger.debug("Testing debug level");
    window.logger.info("Testing info level");
    window.logger.warn("Testing warn level");
    window.logger.error("Testing error level", new Error("Test error"));
    window.logger.critical(
      "Testing critical level",
      new Error("Test critical error")
    );
    window.logger.info("✅ Logger tests passed");
  } catch (error) {
    console.error("Logger test failed:", error);
  }
}

/**
 * Test modal functionality
 */
function testModals() {
  try {
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");

    if (loginModal && registerModal) {
      window.logger.info("✅ Modal elements found");
    } else {
      window.logger.warn("❌ Some modal elements missing", {
        loginModal: !!loginModal,
        registerModal: !!registerModal,
      });
    }
  } catch (error) {
    window.logger.error("Modal test failed", error, "test");
  }
}

/**
 * Test UI interactions
 */
function testUIInteractions() {
  try {
    const roomCards = document.querySelectorAll(".room-card");
    const gameTables = document.querySelectorAll(".game-table");
    const quickLinks = document.querySelectorAll(".quick-link");

    window.logger.info("UI elements test", {
      roomCards: roomCards.length,
      gameTables: gameTables.length,
      quickLinks: quickLinks.length,
    });

    if (
      roomCards.length > 0 ||
      gameTables.length > 0 ||
      quickLinks.length > 0
    ) {
      window.logger.info("✅ UI elements found");
    } else {
      window.logger.warn("❌ No UI elements found for testing");
    }
  } catch (error) {
    window.logger.error("UI interactions test failed", error, "test");
  }
}

/**
 * Test socket connection
 */
function testSocketConnection() {
  try {
    if (window.socketManager) {
      const status = window.socketManager.getStatus();
      window.logger.info("Socket status test", status);

      if (status.isConnected) {
        window.logger.info("✅ Socket is connected");
      } else {
        window.logger.warn("⚠️ Socket is not connected", status);
      }
    } else {
      window.logger.warn("❌ Socket manager not found");
    }
  } catch (error) {
    window.logger.error("Socket connection test failed", error, "test");
  }
}

/**
 * Performance monitoring
 */
function startPerformanceMonitoring() {
  try {
    // Monitor page load performance
    window.addEventListener("load", function () {
      setTimeout(function () {
        const perfData = performance.getEntriesByType("navigation")[0];
        window.logger.info("Page load performance", {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded:
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart,
        });
      }, 0);
    });

    // Monitor memory usage (if available)
    if (performance.memory) {
      setInterval(function () {
        const memInfo = performance.memory;
        window.logger.debug("Memory usage", {
          used: Math.round(memInfo.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(memInfo.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + " MB",
        });
      }, 30000); // Every 30 seconds
    }

    window.logger.info("✅ Performance monitoring started");
  } catch (error) {
    window.logger.error("Performance monitoring setup failed", error, "test");
  }
}

// Initialize socket connection after login/register
document.addEventListener("user-logged-in", () => {
  setTimeout(() => {
    initializeSocketConnection();
  }, 1000);
});

// Initialize socket on page load if user is already logged in
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initializeSocketConnection();
    }
  }, 500);
});

// Make test functions globally available
window.runApplicationTests = runApplicationTests;
window.testLogger = testLogger;
window.testModals = testModals;
window.testUIInteractions = testUIInteractions;
window.testSocketConnection = testSocketConnection;

// Make test functions globally available
window.testUserPresence = testUserPresence;
window.testGameState = testGameState;
window.testGameFunction = testGameFunction;

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
  } catch (error) {
    console.error("Player counts güncellenirken hata:", error);
  }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

/**
 * Initialize modal functionality
 */
function initializeModals() {
  try {
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
        } catch (error) {
          console.error("Login modal açılırken hata:", error);
        }
      });
    }

    // Show register modal
    if (registerBtn && registerModal) {
      registerBtn.addEventListener("click", function () {
        try {
          registerModal.style.display = "flex";
        } catch (error) {
          console.error("Register modal açılırken hata:", error);
        }
      });
    }

    // Close login modal
    if (closeLogin && loginModal) {
      closeLogin.addEventListener("click", function () {
        try {
          loginModal.style.display = "none";
        } catch (error) {
          console.error("Login modal kapanırken hata:", error);
        }
      });
    }

    // Close register modal
    if (closeRegister && registerModal) {
      closeRegister.addEventListener("click", function () {
        try {
          registerModal.style.display = "none";
        } catch (error) {
          console.error("Register modal kapanırken hata:", error);
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
        } catch (error) {
          console.error("Modal geçişinde hata:", error);
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
        } catch (error) {
          console.error("Modal geçişinde hata:", error);
        }
      });
    }

    // Close modals when clicking outside
    window.addEventListener("click", function (event) {
      try {
        if (event.target === loginModal) {
          loginModal.style.display = "none";
        }
        if (event.target === registerModal) {
          registerModal.style.display = "none";
        }
      } catch (error) {
        console.error("Modal dış tıklama işleminde hata:", error);
      }
    });
  } catch (error) {
    console.error("Modal functionality başlatılırken genel hata:", error);
  }
}

// ==========================================
// FORM VALIDATION
// ==========================================

/**
 * Validate login form
 */
function validateLoginForm(username, password) {
  if (!username || !password) {
    alert("Lütfen kullanıcı adı ve şifrenizi girin!");
    return false;
  }

  if (username.length < 3) {
    alert("Kullanıcı adı en az 3 karakter olmalıdır!");
    return false;
  }

  return true;
}

/**
 * Validate registration form
 */
function validateRegistrationForm(username, email, password, confirmPassword) {
  if (!username || !email || !password || !confirmPassword) {
    alert("Lütfen tüm alanları doldurun!");
    return false;
  }

  if (username.length < 3) {
    alert("Kullanıcı adı en az 3 karakter olmalıdır!");
    return false;
  }

  if (password.length < 6) {
    alert("Şifre en az 6 karakter olmalıdır!");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Şifreler eşleşmiyor!");
    return false;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Geçerli bir e-posta adresi girin!");
    return false;
  }

  return true;
}

// ==========================================
// UI INTERACTIONS
// ==========================================

/**
 * Initialize UI interactions
 */
function initializeUIInteractions() {
  try {
    // Add hover effects to room cards
    const roomCards = document.querySelectorAll(".room-card");
    roomCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        try {
          this.style.transform = "translateY(-5px)";
        } catch (error) {
          console.error("Room card hover effect hatası:", error);
        }
      });

      card.addEventListener("mouseleave", function () {
        try {
          this.style.transform = "translateY(0)";
        } catch (error) {
          console.error("Room card leave effect hatası:", error);
        }
      });
    });

    // Add click effects to quick links
    const quickLinks = document.querySelectorAll(".quick-link");

    quickLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        try {
          e.preventDefault();

          // Küçük animasyon
          link.style.transform = "translateY(-3px)";
          const targetUrl = link.getAttribute("href");

          setTimeout(() => {
            link.style.transform = "translateY(0)";
            if (targetUrl) {
              window.location.href = targetUrl; // yönlendirmeyi yap
            }
          }, 300);
        } catch (error) {
          console.error("Quick link click effect hatası:", error);
        }
      });
    });
  } catch (error) {
    console.error("UI interactions initialization hatası:", error);
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
    // Initialize all modules
    initializeModals();
    initializeUIInteractions();
    initializeChatSystem();
    initializeNotificationSystem();
    initializeNavigation();

    // Initialize player counts
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 5000);

    console.log("OkeyMobil uygulaması başarıyla başlatıldı!");
  } catch (error) {
    console.error("Uygulama başlatılırken genel hata:", error);
  }
});

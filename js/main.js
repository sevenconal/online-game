// Update player counts periodically to simulate real-time updates
function updatePlayerCounts() {
    const statCards = document.querySelectorAll('.stat-card .player-count');
    let totalCount = 0;
    
    statCards.forEach((card, index) => {
        // Generate a random number between 60 and 400 for demo purposes
        const currentCount = Math.floor(Math.random() * 341) + 60;
        const totalCapacity = 400;
        card.textContent = `${currentCount}/${totalCapacity} Oyuncu`;
        totalCount += currentCount;
    });
    
    // Update total player count
    const totalPlayerCounts = document.querySelectorAll('h2 span, .total-players span');
    totalPlayerCounts.forEach(span => {
        span.textContent = totalCount;
    });
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    // Show login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
    }
    
    // Show register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            registerModal.style.display = 'flex';
        });
    }
    
    // Close login modal
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    // Close register modal
    if (closeRegister) {
        closeRegister.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }
    
    // Switch to register modal from login
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }
    
    // Switch to login modal from register
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Show register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            registerModal.style.display = 'flex';
        });
    }
    
    // Close login modal
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    // Close register modal
    if (closeRegister) {
        closeRegister.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }
    
    
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would validate credentials here
            alert('Giriş başarılı! (Bu bir demo)');
            loginModal.style.display = 'none';
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real application, you would create a new user here
            alert('Üyelik oluşturuldu! (Bu bir demo)');
            registerModal.style.display = 'none';
        });
    }
    
    // Initialize player counts
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 5000);
    
    // Add hover effects to room cards
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to quick links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'translateY(-3px)';
            setTimeout(() => {
                this.style.transform = 'translateY(0)';
            }, 300);
        });
    });
    
    // Add animation to chat messages
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        // Add new messages periodically
        setInterval(() => {
            const messages = [
                "Oyuna başlayalım mı?",
                "Kimler oynamak istiyor?",
                "Bugün şanslı hissediyorum",
                "Yeni turnuva ne zaman?",
                "Gold üyelik avantajları neler?"
            ];
            
            const users = ["Oyuncu4", "Oyuncu5", "Oyuncu6", "Oyuncu7", "Oyuncu8"];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            const newMessage = document.createElement('div');
            newMessage.className = 'message';
            newMessage.innerHTML = `<span class="user">${randomUser}:</span> <span class="text">${randomMessage}</span>`;
            
            chatMessages.appendChild(newMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Remove oldest message if there are too many
            if (chatMessages.children.length > 20) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
        }, 8000);
    }
    
    // Add animation to notification bar
    const notificationBar = document.querySelector('.notification-bar');
    if (notificationBar) {
        setInterval(() => {
            const notifications = [
                "Yeni Gold üyelik avantajları! Hemen inceleyin.",
                "Haftanın turnuvası bugün başlıyor!",
                "Okey 101 odasında büyük ödül seni bekliyor!",
                "Arkadaşını davet et, ikisiniz de ödül kazanın!"
            ];
            
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            document.querySelector('.notification-bar span').textContent = randomNotification;
        }, 15000);
    }
});
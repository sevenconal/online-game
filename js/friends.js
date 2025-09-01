// Friends Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Friend list interactions
  const friendItems = document.querySelectorAll(".friend-item");
  const dmMessages = document.getElementById("dm-messages");
  const dmInput = document.getElementById("dm-input");
  const sendDmBtn = document.getElementById("send-dm-btn");
  const addFriendBtn = document.getElementById("add-friend-btn");

  // Current active friend
  let activeFriend = "MasterGamer";

  // Sample messages for different friends
  const friendMessages = {
    MasterGamer: [
      {
        type: "received",
        text: "Selam! Nasılsın bugün?",
        time: "14:30",
        avatar: "https://via.placeholder.com/32x32/4CAF50/FFFFFF?text=MG",
      },
      {
        type: "sent",
        text: "Merhaba! İyiyim teşekkürler. Sen nasılsın?",
        time: "14:31",
      },
      {
        type: "received",
        text: "Ben de iyiyim. Biraz okey oynayalım mı?",
        time: "14:32",
        avatar: "https://via.placeholder.com/32x32/4CAF50/FFFFFF?text=MG",
      },
      {
        type: "sent",
        text: "Tabii, neden olmasın! Hangi masaya girelim?",
        time: "14:33",
      },
      {
        type: "received",
        text: "3897 numaralı masa boş, oraya girelim mi?",
        time: "14:34",
        avatar: "https://via.placeholder.com/32x32/4CAF50/FFFFFF?text=MG",
      },
    ],
    ProPlayer: [
      {
        type: "received",
        text: "Hey! Yeni turnuva başladı, katılalım mı?",
        time: "15:20",
        avatar: "https://via.placeholder.com/32x32/2196F3/FFFFFF?text=PP",
      },
      { type: "sent", text: "Tabii! Ne zaman başlayacak?", time: "15:21" },
      {
        type: "received",
        text: "20 dakika sonra. Hazırlan!",
        time: "15:22",
        avatar: "https://via.placeholder.com/32x32/2196F3/FFFFFF?text=PP",
      },
    ],
    GameKing: [
      {
        type: "received",
        text: "Batak oyununa ne dersin?",
        time: "16:10",
        avatar: "https://via.placeholder.com/32x32/FF9800/FFFFFF?text=GK",
      },
      { type: "sent", text: "Tamam, başlayalım!", time: "16:11" },
    ],
    SkillMaster: [
      {
        type: "received",
        text: "Uzun zamandır oynamadık, hadi bir el!",
        time: "17:05",
        avatar: "https://via.placeholder.com/32x32/9C27B0/FFFFFF?text=SM",
      },
    ],
    TopScorer: [
      {
        type: "received",
        text: "Tavla skorumu gördün mü? 😎",
        time: "18:30",
        avatar: "https://via.placeholder.com/32x32/4CAF50/FFFFFF?text=TS",
      },
      { type: "sent", text: "Evet, harikasın! Tebrikler!", time: "18:31" },
    ],
    Champion: [
      {
        type: "received",
        text: "Pişti turnuvasına katılalım mı?",
        time: "19:15",
        avatar: "https://via.placeholder.com/32x32/FF5722/FFFFFF?text=CH",
      },
      { type: "sent", text: "Kesinlikle! Başlayalım.", time: "19:16" },
    ],
    GameWizard: [
      {
        type: "received",
        text: "Yeni stratejimle herkesi yeneceğim! 🎯",
        time: "20:45",
        avatar: "https://via.placeholder.com/32x32/607D8B/FFFFFF?text=GW",
      },
    ],
  };

  // Function to render messages for a friend
  function renderMessages(friendName) {
    const messages = friendMessages[friendName] || [];
    dmMessages.innerHTML = "";

    messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${message.type}`;

      if (message.type === "received") {
        messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <img src="${message.avatar}" alt="${friendName}" />
                    </div>
                    <div class="message-content">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">${message.time}</div>
                    </div>
                `;
      } else {
        messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${message.text}</div>
                        <div class="message-time">${message.time}</div>
                    </div>
                `;
      }

      dmMessages.appendChild(messageDiv);
    });

    // Scroll to bottom
    dmMessages.scrollTop = dmMessages.scrollHeight;
  }

  // Function to update chat header
  function updateChatHeader(friendName) {
    const friendItem = document.querySelector(`[data-friend="${friendName}"]`);
    const avatar = friendItem.querySelector(".friend-avatar img").src;
    const status = friendItem
      .querySelector(".friend-status")
      .textContent.includes("Çevrimiçi")
      ? "online"
      : "away";

    document.querySelector(".chat-avatar").src = avatar;
    document.querySelector(".chat-user-details h4").textContent = friendName;
    document.querySelector(".chat-status").textContent =
      status === "online" ? "Çevrimiçi" : "Uzakta";
    document.querySelector(".chat-status").className = `chat-status ${status}`;
  }

  // Friend item click handler
  friendItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all friends
      friendItems.forEach((friend) => friend.classList.remove("active"));

      // Add active class to clicked friend
      this.classList.add("active");

      // Update active friend
      activeFriend = this.dataset.friend;

      // Update chat header and messages
      updateChatHeader(activeFriend);
      renderMessages(activeFriend);
    });
  });

  // Send message function
  function sendMessage() {
    const messageText = dmInput.value.trim();
    if (messageText === "") return;

    // Add message to current friend's messages
    if (!friendMessages[activeFriend]) {
      friendMessages[activeFriend] = [];
    }

    const now = new Date();
    const timeString =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    friendMessages[activeFriend].push({
      type: "sent",
      text: messageText,
      time: timeString,
    });

    // Render messages
    renderMessages(activeFriend);

    // Clear input
    dmInput.value = "";

    // Simulate response after 2-5 seconds
    setTimeout(() => {
      const responses = [
        "Anladım, devam edelim!",
        "Harika fikir!",
        "Tamam, öyle yapalım.",
        "Katılıyorum!",
        "Bekle, bir düşüneyim...",
        "Evet, başlayalım!",
        "İyi oldu bu.",
        "Teşekkürler!",
        "😊",
        "👍",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      const friendItem = document.querySelector(
        `[data-friend="${activeFriend}"]`
      );
      const avatar = friendItem.querySelector(".friend-avatar img").src;

      friendMessages[activeFriend].push({
        type: "received",
        text: randomResponse,
        time:
          new Date().getHours().toString().padStart(2, "0") +
          ":" +
          new Date().getMinutes().toString().padStart(2, "0"),
        avatar: avatar,
      });

      renderMessages(activeFriend);
    }, Math.random() * 3000 + 2000);
  }

  // Send message on button click
  sendDmBtn.addEventListener("click", sendMessage);

  // Send message on Enter key
  dmInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Add friend button
  addFriendBtn.addEventListener("click", function () {
    const friendName = prompt(
      "Arkadaş eklemek istediğiniz kişinin kullanıcı adını girin:"
    );
    if (friendName && friendName.trim() !== "") {
      alert(`${friendName} kişisine arkadaşlık isteği gönderildi!`);
    }
  });

  // Initialize with first friend
  renderMessages(activeFriend);
  updateChatHeader(activeFriend);

  // Auto-scroll to bottom when new messages arrive
  const observer = new MutationObserver(() => {
    dmMessages.scrollTop = dmMessages.scrollHeight;
  });

  observer.observe(dmMessages, {
    childList: true,
    subtree: true,
  });

  // Typing indicator (simulate)
  let typingTimeout;
  dmInput.addEventListener("input", function () {
    clearTimeout(typingTimeout);
    // In a real app, you would send typing indicator to server

    typingTimeout = setTimeout(() => {
      // Typing stopped
    }, 1000);
  });

  // Friend action buttons
  document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-icon")) {
      const button = e.target.closest(".btn-icon");
      const friendItem = button.closest(".friend-item");
      const friendName = friendItem.dataset.friend;

      if (button.querySelector(".fa-comment")) {
        // Message button clicked
        friendItem.click();
      } else if (button.querySelector(".fa-gamepad")) {
        // Game invite button clicked
        alert(`${friendName} kişisini oyuna davet ettiniz!`);
      } else if (button.querySelector(".fa-phone")) {
        // Voice call
        alert(`${friendName} kişisiyle sesli arama başlatıldı!`);
      } else if (button.querySelector(".fa-video")) {
        // Video call
        alert(`${friendName} kişisiyle görüntülü arama başlatıldı!`);
      }
    }
  });

  // Update friend statuses periodically (simulate)
  setInterval(() => {
    const onlineFriends = document.querySelectorAll(".friend-item.online");
    onlineFriends.forEach((friend) => {
      const statusText = friend.querySelector(".friend-status");
      const activities = [
        "Çevrimiçi - Lobide",
        "Çevrimiçi - Okey oynuyor",
        "Çevrimiçi - Batak oynuyor",
        "Çevrimiçi - Tavla oynuyor",
        "Çevrimiçi - Pişti oynuyor",
        "Çevrimiçi - Mesaj yazıyor",
      ];

      if (Math.random() < 0.3) {
        // 30% chance to change activity
        const randomActivity =
          activities[Math.floor(Math.random() * activities.length)];
        statusText.textContent = randomActivity;
      }
    });
  }, 10000); // Update every 10 seconds
});

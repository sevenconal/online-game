# 🎮 OkeyOnline - Online Okey Platformu

Türk oyunları (Okey, Batak, Tavla, Pişti) oynayabileceğiniz modern, full-stack online oyun platformu.

## ✨ Özellikler

- 🎯 **Çoklu Oyun Desteği**: Okey, Batak, Tavla, Pişti
- 👥 **Gerçek Zamanlı**: Socket.io ile canlı oyun deneyimi
- 🔐 **Güvenli Kimlik Doğrulama**: JWT tabanlı auth sistemi
- ☁️ **Cloud Database**: MongoDB Atlas ile kalıcı veri
- 📱 **Responsive Tasarım**: Mobil uyumlu arayüz
- 🎨 **Modern UI**: Font Awesome ikonları ve CSS3 animasyonları

## 🚀 Kurulum

### Ön Gereksinimler

- Node.js (v16+)
- MongoDB Atlas hesabı (ücretsiz)
- Git

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/sevenconal/online-game.git
cd online-game
```

### 2. Bağımlılıkları Yükleyin

```bash
# Ana dizinde
npm install

# Backend için
cd backend
npm install
cd ..
```

### 3. Environment Variables Ayarlayın

```bash
# .env dosyasını oluşturun
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT Secret (güçlü bir key oluşturun)
JWT_SECRET=your_super_secret_jwt_key_here

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/okeymobil?retryWrites=true&w=majority
```

### 4. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://cloud.mongodb.com/) hesabınıza gidin
2. **"Build a Database"** seçin
3. **M0 Cluster** (ücretsiz) seçin
4. **Database Access** > **Add New Database User**
5. **Network Access** > **Add IP Address** > **Allow Access from Anywhere**
6. **Clusters** > **Connect** > **Connect your application**
7. **Connection String**'i kopyalayın

### 5. Uygulamayı Başlatın

```bash
# Backend'i başlatın
cd backend
npm run dev

# Yeni terminal açın ve frontend'i başlatın
cd ..
python -m http.server 3000
# veya
npx live-server --port=3000
```

### 6. Tarayıcıda Açın

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## 📁 Proje Yapısı

```
okeymobil/
├── backend/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB bağlantısı
│   │   ├── controllers/       # İş mantığı
│   │   │   ├── authController.js
│   │   │   └── roomController.js
│   │   ├── middleware/        # Auth middleware
│   │   │   └── auth.js
│   │   ├── models/           # MongoDB şemaları
│   │   │   ├── User.js
│   │   │   └── Room.js
│   │   ├── routes/           # API endpoint'leri
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── rooms.js
│   │   └── index.js          # Ana server dosyası
│   ├── .env                  # Environment variables
│   └── package.json
├── js/                       # Frontend JavaScript
│   ├── api/                  # API servisleri
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   └── users.js
│   └── main.js               # Ana frontend kodu
├── css/
│   └── style.css             # Ana stylesheet
├── *.html                    # HTML sayfaları
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
└── README.md                # Bu dosya
```

## 🔧 API Endpoints

### Authentication

```http
POST /api/auth/register    # Kullanıcı kaydı
POST /api/auth/login       # Kullanıcı girişi
```

### Users

```http
GET  /api/users/profile    # Kullanıcı profili (JWT gerekli)
```

### Game Rooms

```http
GET    /api/rooms          # Tüm odaları listele
GET    /api/rooms/:id      # Oda detayları
POST   /api/rooms          # Yeni oda oluştur
POST   /api/rooms/:id/join # Odaya katıl
DELETE /api/rooms/:id/leave # Odadan çık
```

### System

```http
GET /health                # Health check
```

## 🧪 Test

### API Test Örnekleri

```bash
# Health check
curl http://localhost:5000/health

# Kullanıcı kaydı
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# Giriş
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Profil (token ile)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Veritabanı

### MongoDB Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hashed
  avatar: String,
  goldCoins: Number,
  level: Number,
  stats: {
    gamesPlayed: Number,
    gamesWon: Number,
    totalScore: Number,
    winRate: Number
  },
  isOnline: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Rooms Collection

```javascript
{
  _id: ObjectId,
  roomId: String,
  name: String,
  gameType: String,
  players: [ObjectId], // User references
  maxPlayers: Number,
  status: String,
  betAmount: Number,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Güvenlik

- **Password Hashing**: bcryptjs ile güvenli şifreleme
- **JWT Authentication**: Stateless authentication
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin security
- **Environment Variables**: Hassas verilerin gizlenmesi

## 🚀 Deployment

### Production için:

1. **Environment Variables** ayarlayın
2. **MongoDB Atlas** production cluster'ı kullanın
3. **SSL Certificate** ekleyin
4. **Process Manager** (PM2) kullanın
5. **Reverse Proxy** (Nginx) kurun

### PM2 ile Production

```bash
cd backend
npm install -g pm2
pm2 start src/index.js --name "okeymobil"
pm2 startup
pm2 save
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: destek@okeymobil.com
- **GitHub**: [yourusername](https://github.com/yourusername)

---

## ✅ Tamamlanan Özellikler

- [x] **Real-time Chat**: Socket.io ile canlı sohbet sistemi
- [x] **Masa Oyunu Arayüzü**: Türk okeyine benzer 2x2 grid masa tasarımı
- [x] **Error Handling**: Kapsamlı hata yakalama ve logging sistemi
- [x] **Testing Framework**: Otomatik test ve debugging sistemi
- [x] **Performance Monitoring**: Sayfa yükleme ve bellek kullanım takibi
- [x] **Responsive Design**: Mobil uyumlu gelişmiş tasarım
- [x] **User Presence**: Gerçek zamanlı çevrimiçi kullanıcı takibi
- [x] **Game State Sync**: Oyun durumu senkronizasyonu

## 🎯 Gelecek Özellikler

- [ ] **Tournament System**: Turnuva yönetimi ve sıralama sistemi
- [ ] **File Upload**: Avatar ve profil resmi yükleme
- [ ] **Payment Integration**: Gold coin satın alma sistemi
- [ ] **Analytics**: Kullanıcı davranış analizi ve raporlama
- [ ] **Advanced Game Modes**: Özel oyun modları ve kuralları
- [ ] **Social Features**: Arkadaş sistemi ve sosyal etkileşimler
- [ ] **Notifications**: Push notification sistemi
- [ ] **Admin Panel**: Yönetim paneli ve moderasyon araçları

---

**🎮 OkeyMobil ile keyifli oyunlar!**

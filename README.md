<p align="center">
  <img src="mobile/assets/images/logo.png" alt="Velox Logo" width="120" height="120">
</p>

<h1 align="center">Velox - Smart Expense Tracker</h1>

<p align="center">
  <strong>A modern, cross-platform expense tracking application built with React Native & Node.js</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-download">Download</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## 📱 Download

<p align="center">
  <a href="YOUR_GDRIVE_LINK_HERE">
    <img src="https://img.shields.io/badge/Download_APK-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Download APK">
  </a>
</p>

> **Latest Version:** 1.0.0  
> **Min Android Version:** Android 5.0 (API 21)  
> **APK Size:** ~25MB

---

## ✨ Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| **Transaction Management** | Add, edit, and delete income/expense transactions with full CRUD operations |
| **Smart Categorization** | 12+ expense categories and 7+ income categories with custom icons |
| **Payment Types** | Track transactions by payment method (Cash, Card, UPI for India) |
| **Real-time Sync** | Cloud synchronization with PostgreSQL backend via REST API |
| **Offline Support** | AsyncStorage caching for offline access with background sync |

### Analytics & Insights
| Feature | Description |
|---------|-------------|
| **Visual Analytics** | Interactive pie charts and line graphs powered by `react-native-chart-kit` |
| **Category Breakdown** | Visual distribution of spending across categories |
| **Payment Method Analysis** | Track spending patterns by payment type |
| **Spending Trends** | Weekly trend visualization with bezier curves |
| **Custom Budgets** | Set weekly/monthly spending limits with progress tracking |

### Multi-Currency Support
| Feature | Description |
|---------|-------------|
| **15+ Currencies** | Support for INR, USD, EUR, GBP, JPY, and more |
| **Live Exchange Rates** | Real-time conversion via ExchangeRate API |
| **Travel Mode** | Automatic currency conversion when traveling abroad |
| **Home Currency** | All amounts converted to home currency for consistent reporting |

### User Experience
| Feature | Description |
|---------|-------------|
| **Responsive Design** | Adaptive UI that scales across all Android devices |
| **Expandable Transactions** | Tap-to-expand transaction cards with smooth animations |
| **Smart Text Handling** | Auto-scaling fonts with `adjustsFontSizeToFit` |
| **Cross-Device Compatibility** | Tested on Pixel, Samsung, OnePlus, and more |

---

## 🛠 Tech Stack

### Frontend (Mobile)
```
├── React Native 0.76.x      # Cross-platform mobile framework
├── Expo SDK 54              # Development platform & build tools
├── Expo Router 6.x          # File-based navigation
├── React Native Chart Kit   # Data visualization
├── Expo Linear Gradient     # UI gradients
├── AsyncStorage             # Local data persistence
└── React Context API        # Global state management
```

### Backend (API Server)
```
├── Node.js 22.x             # Runtime environment
├── Express.js 4.x           # Web framework
├── PostgreSQL 15            # Primary database
├── Neon Database            # Serverless Postgres hosting
├── bcrypt                   # Password hashing
└── CORS                     # Cross-origin resource sharing
```

### DevOps & Build
```
├── EAS Build                # Cloud-based APK/AAB builds
├── Render                   # Backend hosting (auto-sleep enabled)
├── GitHub Actions           # CI/CD pipeline
└── Expo Updates             # OTA updates capability
```

---

## 🏗 Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Mobile)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Screens   │  │  Components │  │     Context Providers   │  │
│  │  (Tabs)     │  │  (Reusable) │  │  (Auth, App, Theme)     │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                     │                 │
│         └────────────────┼─────────────────────┘                 │
│                          │                                       │
│                    ┌─────▼─────┐                                 │
│                    │  API Layer │                                │
│                    │  (fetch)   │                                │
│                    └─────┬─────┘                                 │
└──────────────────────────┼───────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Node.js)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │ Controllers │  │      Middleware         │  │
│  │  /auth      │  │  authCtrl   │  │  CORS, JSON Parser      │  │
│  │  /trans     │  │  transCtrl  │  │  Error Handler          │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
│         │                │                                       │
│         └────────────────┤                                       │
│                          │                                       │
│                    ┌─────▼─────┐                                 │
│                    │  Database │                                 │
│                    │  (Neon)   │                                 │
│                    └───────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure
```
velox-app/
├── mobile/                          # React Native Application
│   ├── app/                         # Expo Router screens
│   │   ├── (tabs)/                  # Tab-based navigation
│   │   │   ├── index.jsx            # Home screen
│   │   │   ├── add.jsx              # Add transaction
│   │   │   ├── analytics.jsx        # Charts & insights
│   │   │   ├── settings.jsx         # User preferences
│   │   │   └── _layout.jsx          # Tab configuration
│   │   ├── auth/                    # Authentication screens
│   │   │   ├── login.jsx
│   │   │   └── signup.jsx
│   │   └── _layout.jsx              # Root layout
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── BalanceCard.jsx      # Balance display widget
│   │   │   └── TransactionItem.jsx  # Transaction list item
│   │   ├── constants/               # App constants
│   │   │   ├── colors.js            # Theme & responsive sizing
│   │   │   ├── categories.js        # Category definitions
│   │   │   └── api.js               # API configuration
│   │   ├── context/                 # React Context providers
│   │   │   ├── AppContext.jsx       # Global app state
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   └── utils/                   # Utility functions
│   │       └── responsive.js        # Responsive scaling utils
│   ├── assets/                      # Static assets
│   ├── app.json                     # Expo configuration
│   ├── eas.json                     # EAS Build configuration
│   └── package.json
│
├── backend/                         # Node.js API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Database connection
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── transactionsController.js
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoute.js
│   │   │   └── transactionsRoute.js
│   │   └── server.js                # Express app entry
│   ├── .env                         # Environment variables
│   └── package.json
│
└── README.md
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    payment_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

---

## 🔌 API Reference

### Base URL
```
Production: https://velox-backend.onrender.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
    "id": "user_unique_id",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

### Transaction Endpoints

#### Get User Transactions
```http
GET /api/transactions/:userId
```

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
    "user_id": "user_unique_id",
    "title": "Grocery Shopping",
    "amount": -2500.00,
    "category": "food",
    "payment_type": "upi",
    "created_at": "2026-01-30T10:00:00Z"
}
```

#### Update Transaction
```http
PUT /api/transactions/:id
Content-Type: application/json

{
    "title": "Updated Title",
    "amount": -3000.00,
    "category": "shopping",
    "payment_type": "card"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
```

#### Get Summary
```http
GET /api/transactions/summary/:userId

Response:
{
    "balance": 45000.00,
    "income": 75000.00,
    "expense": -30000.00
}
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for emulator) or physical device with Expo Go

### Clone Repository
```bash
git clone https://github.com/Ansu6000/velox-app.git
cd velox-app
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=5000
EOF

# Start server
npm run dev
```

### Mobile Setup
```bash
cd mobile
npm install

# Start Expo development server
npm start

# Or start with cache cleared
npm start -- --clear
```

### Build APK
```bash
cd mobile

# Login to EAS
npx eas-cli login

# Build APK (preview profile)
npx eas-cli build --platform android --profile preview

# Build production AAB
npx eas-cli build --platform android --profile production
```

---

## 📱 Responsive Design System

### Scaling Functions
```javascript
// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const scale = SCREEN_WIDTH / BASE_WIDTH;

// Font scaling (respects user preferences)
const fontScale = (size) => {
    const newSize = size * Math.min(scale, 1.3);
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Spacing scaling
const spaceScale = (size) => {
    return Math.round(size * Math.min(scale, 1.2));
};
```

### Cross-Device Compatibility
| Technique | Purpose |
|-----------|---------|
| `numberOfLines` | Prevents text overflow |
| `adjustsFontSizeToFit` | Auto-shrinks text to fit container |
| `flexShrink: 1` | Allows flex children to shrink |
| `minWidth: 0` | Enables proper flex overflow |
| `marginRight` over `gap` | Android <21 compatibility |

---

## 🔒 Security Features

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with salt rounds |
| API Timeout | 30-second AbortController timeout |
| Input Validation | Server-side validation on all endpoints |
| Secure Storage | Sensitive data in AsyncStorage (encrypted on device) |

---

## 📈 Performance Optimizations

| Optimization | Benefit |
|--------------|---------|
| `useMemo` hooks | Prevents unnecessary recalculations |
| `LayoutAnimation` | Smooth UI transitions |
| Lazy loading | Screens loaded on demand |
| Image optimization | Compressed assets |
| AsyncStorage caching | Reduced API calls |

---

## 🧪 Testing

```bash
# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run on web browser
npm run web
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ansu Sharma**

<p>
  <a href="https://github.com/Ansu6000">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
</p>

---

<p align="center">
  Made with ❤️ using React Native & Node.js
</p>

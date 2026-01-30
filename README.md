# Velox

A clean, fast expense tracker built with React Native and Node.js.

[Download APK](https://drive.google.com/file/d/1e-7cTsElIwfmp22d7yVJS1BJ1P0pfEBx/view?usp=sharing) · [Report Bug](https://github.com/Ansu6000/velox-app/issues)

---

## What is Velox?

Velox is a personal finance app that helps you track where your money goes. No bloat, no ads—just a straightforward way to log expenses, categorize spending, and see where you can save.

Built this because I wanted something that works offline, syncs when connected, and doesn't require a subscription.

---

## Features

**Core**
- Add income and expenses with categories
- Track payment methods (Cash, Card, UPI)
- Real-time cloud sync with offline support
- Multi-currency with live exchange rates

**Analytics**
- Visual spending breakdown by category
- Weekly/monthly trends
- Payment method distribution
- Budget tracking with goals

**Design**
- Clean blue & white aesthetic
- Responsive across all Android devices
- Smooth animations
- Works on Android 5.0+

---

## Tech Stack

### Mobile App
- React Native 0.76 with Expo SDK 54
- Expo Router for navigation
- AsyncStorage for offline caching
- Chart Kit for visualizations

### Backend
- Node.js + Express
- PostgreSQL (Neon serverless)
- Hosted on Render

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android device or emulator

### Installation

```bash
# Clone the repo
git clone https://github.com/Ansu6000/velox-app.git
cd velox-app

# Backend setup
cd backend
npm install
cp .env.example .env  # Add your database credentials
npm run dev

# Mobile setup (new terminal)
cd mobile
npm install
npm start
```

Scan the QR code with Expo Go to run on your phone.

### Building APK

```bash
cd mobile
npx eas-cli build --platform android --profile preview
```

---

## Project Structure

```
velox-app/
├── mobile/
│   ├── app/              # Screens (Expo Router)
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── context/      # App & Auth state
│   │   └── constants/    # Colors, categories
│   └── assets/           # Images, fonts
│
└── backend/
    ├── src/
    │   ├── controllers/  # Request handlers
    │   ├── routes/       # API endpoints
    │   └── config/       # Database setup
    └── .env.example      # Environment template
```

---

## API Endpoints

Base URL: `https://velox-app.onrender.com/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create account |
| POST | `/auth/login` | Sign in |
| GET | `/transactions/:userId` | Get all transactions |
| POST | `/transactions` | Add transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

---

## Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5001
DATABASE_URL=your_neon_postgres_url
```

---

## Screenshots

*Coming soon*

---

## Known Issues

- First API call may be slow (Render cold start)
- Currency conversion requires internet

---

## Contributing

Pull requests welcome. For major changes, open an issue first.

---

## License

MIT

---

Built by [Ansu Sharma](https://github.com/Ansu6000)

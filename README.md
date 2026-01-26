# 🚀 Velox - Smart Finance Tracker

**Velox** is a modern, premium personal finance application built to help you track your wealth with speed using a sleek, intuitive mobile interface. Whether you're at home or traveling the world, Velox adapts to your needs with powerful multi-currency support and real-time analytics.

![Velox Banner](mobile/assets/images/logo.png) *Note: Logo available in local assets*

---

## ✨ Key Features

### 💸 **Seamless Transaction Tracking**
- **Income & Expenses**: Easily log your financial flow.
- **Backdated Entry**: Forgot to add last night's dinner? Use the **calendar picker** to log past transactions accurately.
- **Instant Reset**: Forms clear automatically after submission for rapid entry.

### 🌍 **Travel Mode (Multi-Currency)**
- **Real-Time Conversion**: Automatically converts foreign spending like USD, EUR, or GBP back to your home currency (e.g., INR) using live exchange rates.
- **Smart Toggle**: Enable "Travel Mode" in settings to see exactly how much you're spending in your own currency while abroad.

### 📊 **Advanced Analytics**
- **Interactive Pie Charts**: Visualize your spending habits with a centered, color-coded category breakdown.
- **Custom Legends**: Clean, readable lists of your spending categories alongside the chart.
- **Savings Goals**: Set monthly or weekly limits and track your progress with dynamic progress bars.

### 🎨 **Premium UI/UX**
- **Modern Aesthetic**: Glassmorphism effects, smooth gradients, and subtle animations.
- **Dark/Light Mode Compatible**: Designed with readability and elegance in mind.
- **Velox Branding**: Consistent identity across all screens, from Auth to Analytics.

---

## 🛠️ Tech Stack

### **Mobile App (Frontend)**
- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (Expo Router)
- **Styling**: Custom StyleSheet with a unified Design System (`colors.js`, `sizes.js`)
- **Charts**: `react-native-chart-kit` for beautiful visualization
- **State Management**: React Context API (`AppContext`, `AuthContext`)

### **Backend API**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via **Neon Serverless**)
- **Caching/Rate Limiting**: **Upstash Redis** (ready for high-scale traffic)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone (or a Simulator)

### 1️⃣ Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with your credentials:
```env
DATABASE_URL=postgres://<user>:<password>@<host>/<dbname>
PORT=5001
# Add Upstash Redis credentials if enabling rate limiting
```

Start the server:
```bash
npm run dev
# Server runs on http://localhost:5001
```

### 2️⃣ Mobile App Setup
Open a new terminal, navigate to the mobile directory, and install dependencies:
```bash
cd mobile
npm install
```

Start the Expo development server:
```bash
npx expo start --clear
```
- **Scan the QR code** with your phone (Android/iOS) to run Velox instantly.
- Or press `i` to run on iOS Simulator / `a` for Android Emulator.

---

## 📱 Screenshots & Design
*(Add screenshots here of the Login, Home, and Analytics screens to showcase the beautiful UI)*

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

## 📄 License
This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by the Velox Team
</p>

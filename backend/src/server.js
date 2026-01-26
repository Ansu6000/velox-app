import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDB } from "./config/db.js";
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import authRoute from './routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// JSON validation middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next();
});

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// app.use(rateLimiter); // Temporarily disabled to debug connectivity issues

app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionsRoute);

// Ping route
app.get("/api/ping", (req, res) => res.json({ status: "ok" }));

// 404 Handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});


initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
});


console.log("my port: ", process.env.PORT);




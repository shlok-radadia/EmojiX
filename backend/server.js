import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import dexRoutes from "./routes/dexRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import dailyRoutes from "./routes/dailyRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/dex", dexRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api", dailyRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/profile", profileRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

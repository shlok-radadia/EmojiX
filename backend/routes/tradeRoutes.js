import express from "express";
import {
  createTrade,
  cancelTrade,
  buyTrade,
  getTrades,
} from "../controllers/tradeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTrades);
router.post("/create", protect, createTrade);
router.post("/cancel", protect, cancelTrade);
router.post("/buy", protect, buyTrade);

export default router;

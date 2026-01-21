import express from "express";
import { getMarketItems, buyItem } from "../controllers/marketController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/items", protect, getMarketItems);
router.post("/buy", protect, buyItem);

export default router;

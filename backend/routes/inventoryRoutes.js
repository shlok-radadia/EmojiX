import express from "express";
import { getEmojiInventory } from "../controllers/inventoryController.js";
import { protect } from "../middleware/auth.js";
import { sellEmoji } from "../controllers/sellEmojiController.js";

const router = express.Router();

router.get("/emojis", protect, getEmojiInventory);
router.post("/sell", protect, sellEmoji);

export default router;

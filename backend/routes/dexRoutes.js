import express from "express";
import { protect } from "../middleware/auth.js";
import { getDex } from "../controllers/dexController.js";
import { getEmojiDetails } from "../controllers/dexController.js";

const router = express.Router();

router.get("/", protect, getDex);
router.get("/:emojiId", protect, getEmojiDetails);

export default router;

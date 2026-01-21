import express from "express";
import { getQuests, rerollQuest } from "../controllers/questController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getQuests);
router.post("/reroll", protect, rerollQuest);

export default router;

import express from "express";
import { claimDailyBonus } from "../controllers/dailyController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/daily/claim", protect, claimDailyBonus);

export default router;

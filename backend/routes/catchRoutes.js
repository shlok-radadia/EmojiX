import express from "express";
import { protect } from "../middleware/auth.js";
import { catchEmoji } from "../controllers/catchController.js";

const router = express.Router();

router.post("/catch", protect, catchEmoji);

export default router;

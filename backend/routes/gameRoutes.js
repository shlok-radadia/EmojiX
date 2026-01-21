import express from "express";
import { protect } from "../middleware/auth.js";
import { moveUser } from "../controllers/gameController.js";
import { catchEmoji } from "../controllers/catchController.js";

const router = express.Router();

router.post("/move", protect, moveUser);
router.post("/catch", protect, catchEmoji);

export default router;

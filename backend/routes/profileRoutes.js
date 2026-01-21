import express from "express";
import {
  getProfileStats,
  getProfileInventory,
  getProfileTrades,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/:userId/stats", getProfileStats);
router.get("/:userId/inventory", getProfileInventory);
router.get("/:userId/trades", getProfileTrades);

export default router;

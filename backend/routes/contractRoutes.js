import express from "express";
import {
  getContracts,
  claimContract,
} from "../controllers/contractController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getContracts);
router.post("/claim", protect, claimContract);

export default router;

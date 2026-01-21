// controllers/dailyController.js
import User from "../models/User.js";

export const claimDailyBonus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const now = new Date();
    const today = now.toDateString();

    if (
      user.lastDailyClaim &&
      new Date(user.lastDailyClaim).toDateString() === today
    ) {
      return res.status(400).json({
        message: "Daily bonus already claimed",
      });
    }

    const BONUS_COINS = 50;

    user.coins += BONUS_COINS;
    user.lastDailyClaim = now;

    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      reward: BONUS_COINS,
    });
  } catch (err) {
    console.error("DAILY BONUS ERROR:", err);
    res.status(500).json({ message: "Failed to claim daily bonus" });
  }
};

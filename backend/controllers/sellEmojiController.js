import EmojiInstance from "../models/EmojiInstance.js";
import User from "../models/User.js";
import { RARITY_BASE_PRICE, VARIANT_MULTIPLIER } from "../config/sellRules.js";

const baseValue = RARITY_BASE_PRICE;

export const sellEmoji = async (req, res) => {
  try {
    const { instanceId } = req.body;

    if (!instanceId) {
      return res.status(400).json({ message: "Instance ID required" });
    }

    const instance = await EmojiInstance.findById(instanceId).populate("emoji");
    if (!instance) {
      return res.status(404).json({ message: "Emoji instance not found" });
    }

    if (instance.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your emoji" });
    }

    const user = await User.findById(req.user.id);

    const rarityValue = baseValue[instance.finalRarity || instance.rarity] || 1;
    const variantMultiplier = VARIANT_MULTIPLIER[instance.variant] || 1;

    const sellValue = Math.floor(rarityValue * variantMultiplier);

    user.coins += sellValue;

    user.questProgressBuffer.sell += 1;

    await instance.deleteOne();
    await user.save();

    return res.json({
      success: true,
      gained: sellValue,
      totalCoins: user.coins,
    });
  } catch (err) {
    console.error("SELL ERROR:", err);
    return res.status(500).json({ message: "Failed to sell emoji" });
  }
};

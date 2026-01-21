import User from "../models/User.js";
import EmojiCatalog from "../models/EmojiCatalog.js";
import EmojiInstance from "../models/EmojiInstance.js";
import { rarityRules } from "../config/rarityRules.js";
import { getBiome } from "../utils/biomes.js";
import { VARIANTS } from "../config/variants.js";
import { getActiveItemEffect } from "../utils/getItemEffect.js";

const RARITY_ORDER = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Mythic",
  "Legendary",
];

function getFinalRarity(baseRarity, variant) {
  const baseIndex = RARITY_ORDER.indexOf(baseRarity);
  const boost = VARIANTS[variant]?.rarityBoost ?? 0;

  return RARITY_ORDER[Math.min(baseIndex + boost, RARITY_ORDER.length - 1)];
}

export const catchEmoji = async (req, res) => {
  try {
    const { emojiId, variant = "Normal" } = req.body;

    if (!emojiId) {
      return res.status(400).json({ message: "Emoji ID required" });
    }

    /* ---------- USER ---------- */
    const user = await User.findById(req.user.id);
    if (!user || !user.runPosition) {
      return res.status(400).json({ message: "User not ready" });
    }

    /* ---------- EMOJI ---------- */
    const emoji = await EmojiCatalog.findById(emojiId);
    if (!emoji) {
      return res.status(404).json({ message: "Emoji not found" });
    }

    /* ---------- BIOME CHECK ---------- */
    const biome = getBiome(user.runPosition.x, user.runPosition.y);
    if (!emoji.biomes.includes(biome)) {
      return res.status(400).json({ message: "Wrong biome for this emoji" });
    }

    /* ---------- RARITY & VARIANT ---------- */
    const rules = rarityRules[emoji.rarity];
    const variantData = VARIANTS[variant] || VARIANTS.Normal;

    const baseCatchChance = emoji.catchChanceOverride ?? rules.catchChance;

    const catchChance = baseCatchChance * variantData.catchModifier;
    const catchCost = emoji.catchCostOverride ?? rules.catchCost;

    if (user.coins < catchCost) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    user.coins -= catchCost;

    /* ---------- ROLL ---------- */
    const roll = Math.random() * 100;

    const item = await getActiveItemEffect(user);
    let finalCatchChance = catchChance;
    if (item?.effect.type === "catch_chance") {
      finalCatchChance += item.effect.value;
    }
    finalCatchChance = Math.min(finalCatchChance, 85);

    if (roll > finalCatchChance) {
      await user.save();
      return res.json({
        success: false,
        coins: user.coins,
        message: "Emoji escaped",
      });
    }

    /* ---------- FINAL RARITY ---------- */
    const finalRarity = getFinalRarity(emoji.rarity, variant);

    /* ---------- SAVE INSTANCE ---------- */
    const instance = await EmojiInstance.create({
      emoji: emoji._id,
      owner: user._id,

      rarity: emoji.rarity, // ✅ BASE rarity
      variant, // ✅ variant
      finalRarity, // ✅ boosted rarity
    });

    user.questProgressBuffer.catch += 1;

    await user.save();

    return res.json({
      success: true,
      coins: user.coins,
      emoji: {
        id: instance._id,
        symbol: emoji.symbol,
        name: emoji.name,
        rarity: emoji.rarity,
        variant,
        finalRarity,
      },
    });
  } catch (err) {
    console.error("CATCH ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

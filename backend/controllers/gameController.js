import User from "../models/User.js";
import EmojiCatalog from "../models/EmojiCatalog.js";
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

function getFinalRarity(base, variant) {
  const baseIndex = RARITY_ORDER.indexOf(base);
  const boost = VARIANTS[variant]?.rarityBoost ?? 0;

  return RARITY_ORDER[Math.min(baseIndex + boost, RARITY_ORDER.length - 1)];
}

function rollVariant() {
  const roll = Math.random();

  if (roll < 0.75) return "Normal";
  if (roll < 0.9) return "Shiny";
  if (roll < 0.98) return "Alpha";
  return "Corrupted";
}

export const moveUser = async (req, res) => {
  try {
    const { direction } = req.body;

    const delta = {
      UP: { x: 0, y: 1 },
      DOWN: { x: 0, y: -1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };

    if (!delta[direction]) {
      return res.status(400).json({ message: "Invalid direction" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.runPosition) {
      user.runPosition = { x: 0, y: 0 };
    }

    user.runPosition.x += delta[direction].x;
    user.runPosition.y += delta[direction].y;

    const STEP_REWARD_THRESHOLD = 20;
    const STEP_REWARD_COINS = 5;

    user.stepsSinceReward += 1;

    const item = await getActiveItemEffect(user);

    let explorationReward = 0;
    let bonusReward = 0;

    if (user.stepsSinceReward >= STEP_REWARD_THRESHOLD) {
      explorationReward = STEP_REWARD_COINS;
      user.coins += STEP_REWARD_COINS;

      if (item?.effect.type === "coin_bonus_on_move") {
        bonusReward = item.effect.value;
        user.coins += bonusReward;
      }

      user.stepsSinceReward = 0;
    }

    if (item?.effect.type === "coin_per_step") {
      user.coins += item.effect.value;
    }

    user.questProgressBuffer.move += 1;

    await user.save();

    const biome = getBiome(user.runPosition.x, user.runPosition.y);

    const spawnRoll = Math.random();
    let spawnChance = 0.35;

    if (item?.effect.type === "spawn_rate") {
      spawnChance += item.effect.value;
    }

    spawnChance = Math.min(spawnChance, 0.8);

    if (spawnRoll > spawnChance) {
      return res.json({
        moved: true,
        spawned: false,
        position: user.runPosition,
        biome,
        explorationReward,
        bonusReward,
        coins: user.coins,
      });
    }

    const biomeEmojis = await EmojiCatalog.find({
      biomes: { $in: [biome] },
    });

    if (biomeEmojis.length === 0) {
      return res.json({
        moved: true,
        spawned: false,
        position: user.runPosition,
        biome,
        explorationReward,
        bonusReward,
        coins: user.coins,
      });
    }

    const roll = Math.random() * 100;
    let rarity = "Common";

    if (roll >= 55 && roll < 80) rarity = "Uncommon";
    else if (roll >= 80 && roll < 92) rarity = "Rare";
    else if (roll >= 92 && roll < 98) rarity = "Epic";
    else if (roll >= 98 && roll < 99.8) rarity = "Mythic";
    else if (roll >= 99.8) rarity = "Legendary";

    let pool = biomeEmojis.filter((e) => e.rarity === rarity);

    if (pool.length === 0) {
      pool = biomeEmojis.filter((e) => e.rarity === "Common");
    }

    if (pool.length === 0) {
      return res.json({
        moved: true,
        spawned: false,
        position: user.runPosition,
        biome,
        explorationReward,
        bonusReward,
        coins: user.coins,
      });
    }

    const emoji = pool[Math.floor(Math.random() * pool.length)];

    const variant = rollVariant();

    const finalRarity = getFinalRarity(emoji.rarity, variant);

    return res.json({
      moved: true,
      spawned: true,
      position: user.runPosition,
      biome,
      emoji: {
        id: emoji._id,
        symbol: emoji.symbol,
        name: emoji.name,
        baseRarity: emoji.rarity,
        rarity: finalRarity,
        variant,
      },
      explorationReward,
      bonusReward,
      coins: user.coins,
    });
  } catch (err) {
    console.error("MOVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

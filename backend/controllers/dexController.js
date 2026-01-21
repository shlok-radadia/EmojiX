import mongoose from "mongoose";
import EmojiCatalog from "../models/EmojiCatalog.js";
import EmojiInstance from "../models/EmojiInstance.js";

const RARITY_ORDER = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Mythic",
  "Legendary",
];

const VARIANT_ORDER = ["Normal", "Shiny", "Alpha", "Corrupted"];

function sortVariants(arr) {
  const map = new Map(arr.map((v) => [v._id, v.count]));
  return VARIANT_ORDER.map((v) => ({
    _id: v,
    count: map.get(v) || 0,
  }));
}

export const getDex = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const emojis = await EmojiCatalog.find().lean();
    const emojiMap = new Map(emojis.map((e) => [e._id.toString(), e]));

    const caught = await EmojiInstance.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: "$emoji",
          count: { $sum: 1 },
          firstCaughtAt: { $min: "$createdAt" },
          variants: { $addToSet: "$variant" },
        },
      },
    ]);

    const caughtMap = new Map(caught.map((c) => [c._id.toString(), c]));

    const dex = emojis.map((emoji) => {
      const found = caughtMap.get(emoji._id.toString());

      return {
        id: emoji._id.toString(),
        symbol: emoji.symbol,
        name: emoji.name,
        rarity: emoji.rarity,
        biomes: emoji.biomes || [],
        discovered: !!found,
        count: found?.count || 0,
        variants: found?.variants || [],
        firstDiscoveredAt: found?.firstCaughtAt || null,
      };
    });

    dex.sort((a, b) => {
      return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
    });

    const progress = {
      discovered: dex.filter((e) => e.discovered).length,
      total: dex.length,
      rarity: {},
      biomes: {},
    };

    for (const emoji of emojis) {
      progress.rarity[emoji.rarity] ??= { discovered: 0, total: 0 };
      progress.rarity[emoji.rarity].total++;
    }

    for (const emoji of emojis) {
      for (const biome of emoji.biomes || []) {
        progress.biomes[biome] ??= { discovered: 0, total: 0 };
        progress.biomes[biome].total++;
      }
    }

    for (const entry of dex) {
      if (!entry.discovered) continue;

      progress.rarity[entry.rarity].discovered++;
      for (const biome of emojiMap.get(entry.id).biomes || []) {
        progress.biomes[biome].discovered++;
      }
    }

    return res.json({ dex, progress });
  } catch (err) {
    console.error("DEX ERROR:", err);
    return res.status(500).json({ message: "Failed to load EmojiDex" });
  }
};

export const getEmojiDetails = async (req, res) => {
  try {
    const { emojiId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    if (!mongoose.Types.ObjectId.isValid(emojiId)) {
      return res.status(400).json({ message: "Invalid emoji ID" });
    }

    const emoji = await EmojiCatalog.findById(emojiId).lean();
    if (!emoji) {
      return res.status(404).json({ message: "Emoji not found" });
    }

    const userInstances = await EmojiInstance.find({
      emoji: emojiId,
      owner: userId,
    }).sort({ createdAt: 1 });

    const userVariants = await EmojiInstance.aggregate([
      { $match: { emoji: emoji._id, owner: userId } },
      { $group: { _id: "$variant", count: { $sum: 1 } } },
    ]);

    const globalVariants = await EmojiInstance.aggregate([
      { $match: { emoji: emoji._id } },
      { $group: { _id: "$variant", count: { $sum: 1 } } },
    ]);

    return res.json({
      id: emoji._id.toString(),
      symbol: emoji.symbol,
      name: emoji.name,
      rarity: emoji.rarity,
      biomes: emoji.biomes || [],
      lore: emoji.lore || null,

      discovered: userInstances.length > 0,
      count: userInstances.length,
      firstDiscoveredAt: userInstances[0]?.createdAt || null,

      totalCaught: globalVariants.reduce((s, v) => s + v.count, 0),
      variants: {
        user: sortVariants(userVariants),
        global: sortVariants(globalVariants),
      },
    });
  } catch (err) {
    console.error("DEX DETAIL ERROR:", err);
    return res.status(500).json({ message: "Failed to load emoji details" });
  }
};

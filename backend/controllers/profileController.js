import User from "../models/User.js";
import EmojiInstance from "../models/EmojiInstance.js";
import Trade from "../models/Trade.js";

/* ===============================
   PROFILE STATS
================================ */
export const getProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const emojis = await EmojiInstance.find({ owner: userId }).lean();

    const uniqueEmojiIds = new Set(emojis.map((e) => e.emoji.toString()));

    const activeTrades = await Trade.countDocuments({
      seller: userId,
      active: true,
    });

    /* ================= RARITY BREAKDOWN ================= */
    const rarityCount = {};
    const variantCount = {};

    for (const e of emojis) {
      rarityCount[e.finalRarity] = (rarityCount[e.finalRarity] || 0) + 1;

      variantCount[e.variant] = (variantCount[e.variant] || 0) + 1;
    }

    return res.json({
      username: user.username,
      joinedAt: user.createdAt,
      coins: user.coins,

      stats: {
        emojisOwned: emojis.length,
        uniqueEmojis: uniqueEmojiIds.size,
        emojisInTrade: activeTrades,

        rarityBreakdown: rarityCount,
        variantBreakdown: variantCount,
      },
    });
  } catch (err) {
    console.error("PROFILE STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

/* ===============================
   PROFILE INVENTORY (NO TRADE)
================================ */
export const getProfileInventory = async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await EmojiInstance.find({
      owner: userId,
      lockedForTrade: false,
    })
      .populate("emoji")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      items: items.map((e) => ({
        instanceId: e._id,
        symbol: e.emoji.symbol,
        name: e.emoji.name,
        rarity: e.finalRarity,
        variant: e.variant,
        caughtAt: e.createdAt,
      })),
    });
  } catch (err) {
    console.error("PROFILE INVENTORY ERROR:", err);
    res.status(500).json({ message: "Failed to load inventory" });
  }
};

/* ===============================
   PROFILE TRADES
================================ */
export const getProfileTrades = async (req, res) => {
  try {
    const { userId } = req.params;

    const trades = await Trade.find({
      seller: userId,
      active: true,
    })
      .populate({
        path: "emojiInstance",
        populate: { path: "emoji" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      trades: trades.map((t) => ({
        tradeId: t._id,
        price: t.price,
        symbol: t.emojiInstance.emoji.symbol,
        name: t.emojiInstance.emoji.name,
        rarity: t.emojiInstance.finalRarity,
        variant: t.emojiInstance.variant,
        listedAt: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("PROFILE TRADES ERROR:", err);
    res.status(500).json({ message: "Failed to load trades" });
  }
};

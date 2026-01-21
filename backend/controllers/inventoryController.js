import EmojiInstance from "../models/EmojiInstance.js";

/* ===============================
   GET EMOJI INVENTORY
================================ */
export const getEmojiInventory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rarity, variant, biome, search } = req.query;

    /* ---------- BASE FILTER ---------- */
    const filter = {
      owner: userId,
      lockedForTrade: false,
    };

    if (rarity) filter.finalRarity = rarity;
    if (variant) filter.variant = variant;

    /* ---------- QUERY ---------- */
    let instances = await EmojiInstance.find(filter)
      .populate("emoji")
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      instances = instances.filter((i) =>
        i.emoji.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    /* ---------- BIOME FILTER (FROM CATALOG) ---------- */
    if (biome) {
      instances = instances.filter((i) => i.emoji.biomes.includes(biome));
    }

    /* ---------- FORMAT ---------- */
    const items = instances.map((i) => ({
      instanceId: i._id.toString(),
      symbol: i.emoji.symbol,
      name: i.emoji.name,

      baseRarity: i.baseRarity,
      finalRarity: i.finalRarity,
      variant: i.variant,

      biomes: i.emoji.biomes,
      caughtAt: i.createdAt,
    }));

    return res.json({ items });
  } catch (err) {
    console.error("INVENTORY ERROR:", err);
    return res.status(500).json({ message: "Failed to load inventory" });
  }
};

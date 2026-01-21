import Trade from "../models/Trade.js";
import EmojiInstance from "../models/EmojiInstance.js";
import User from "../models/User.js";

export const createTrade = async (req, res) => {
  const { instanceId, price } = req.body;

  if (!price || price <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  const emoji = await EmojiInstance.findById(instanceId);
  if (!emoji || emoji.owner._id.toString() !== req.user.id) {
    return res.status(403).json({ message: "Invalid emoji" });
  }

  if (emoji.lockedForTrade) {
    return res.status(400).json({ message: "Already listed" });
  }

  emoji.lockedForTrade = true;
  await emoji.save();

  await Trade.create({
    seller: req.user.id,
    emojiInstance: emoji._id,
    price,
  });

  res.json({ success: true });
};

export const cancelTrade = async (req, res) => {
  const { tradeId } = req.body;

  const trade = await Trade.findById(tradeId).populate("emojiInstance");

  if (!trade || trade.seller._id.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  trade.active = false;
  //   trade.emojiInstance.lockedForTrade = false;

  await EmojiInstance.findByIdAndUpdate(trade.emojiInstance, {
    lockedForTrade: false,
  });

  //   await trade.emojiInstance.save();
  await trade.save();

  res.json({ success: true });
};

export const buyTrade = async (req, res) => {
  const { tradeId } = req.body;

  const trade = await Trade.findById(tradeId)
    .populate("emojiInstance")
    .populate("seller");

  if (!trade || !trade.active) {
    return res.status(404).json({ message: "Trade unavailable" });
  }

  if (trade.seller._id.toString() === req.user.id) {
    return res.status(400).json({ message: "Cannot buy your own emoji" });
  }

  const buyer = await User.findById(req.user.id);
  if (buyer.coins < trade.price) {
    return res.status(400).json({ message: "Not enough coins" });
  }

  buyer.coins -= trade.price;
  trade.seller.coins += trade.price;

  trade.emojiInstance.owner = buyer._id;
  trade.emojiInstance.lockedForTrade = false;
  trade.active = false;

  await buyer.save();
  await trade.seller.save();
  await trade.emojiInstance.save();
  await trade.save();

  res.json({ success: true, coins: buyer.coins });
};

export const getTrades = async (req, res) => {
  const { rarity, variant, search, mine } = req.query;

  let trades = await Trade.find({
    active: true,
    ...(mine === "true" ? { seller: req.user.id } : {}),
  })
    .populate("seller", "username")
    .populate({
      path: "emojiInstance",
      populate: { path: "emoji" },
    })
    .sort({ createdAt: -1 })
    .lean();

  if (rarity) {
    trades = trades.filter((t) => t.emojiInstance.finalRarity === rarity);
  }

  if (variant) {
    trades = trades.filter((t) => t.emojiInstance.variant === variant);
  }

  if (search) {
    trades = trades.filter((t) =>
      t.emojiInstance.emoji.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  //   console.log(trades[0].seller._id.toString() === req.user.id);

  res.json({
    trades: trades.map((t) => ({
      tradeId: t._id,
      price: t.price,
      instanceId: t.emojiInstance._id,
      symbol: t.emojiInstance.emoji.symbol,
      name: t.emojiInstance.emoji.name,
      rarity: t.emojiInstance.finalRarity,
      variant: t.emojiInstance.variant,
      mine: t.seller._id.toString() === req.user.id,

      seller: {
        id: t.seller._id,
        username: t.seller.username,
      },
    })),
  });
};

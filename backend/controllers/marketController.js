import ItemCatalog from "../models/ItemCatalog.js";
import UserItem from "../models/UserItem.js";
import User from "../models/User.js";

export const buyItem = async (req, res) => {
  const { itemId } = req.body;

  const user = await User.findById(req.user.id);
  const item = await ItemCatalog.findById(itemId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const owned = await UserItem.findOne({
    owner: user._id,
    item: item._id,
  });

  if (owned) {
    return res.status(400).json({ message: "Item already owned" });
  }

  if (user.coins < item.price) {
    return res.status(400).json({ message: "Not enough coins" });
  }

  user.coins -= item.price;

  await UserItem.create({
    owner: user._id,
    item: item._id,
  });

  await user.save();

  res.json({
    success: true,
    coins: user.coins,
  });
};

export const getMarketItems = async (req, res) => {
  const items = await ItemCatalog.find().sort({ price: 1 }).lean();
  res.json({ items });
};

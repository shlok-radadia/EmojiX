import mongoose from "mongoose";
import User from "../models/User.js";
import UserItem from "../models/UserItem.js";

export const equipItem = async (req, res) => {
  const { userItemId } = req.body;

  const user = await User.findById(req.user.id);
  const item = await UserItem.findById(userItemId);

  if (!item || item.owner.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "Invalid item" });
  }

  // Unequip previous
  if (user.equippedItem) {
    await UserItem.findByIdAndUpdate(user.equippedItem, {
      equipped: false,
    });
  }

  item.equipped = true;
  user.equippedItem = item._id;

  await item.save();
  await user.save();

  res.json({ success: true });
};

export const unequipItem = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.equippedItem) {
    return res.json({ success: true });
  }

  await UserItem.findByIdAndUpdate(user.equippedItem, {
    equipped: false,
  });

  user.equippedItem = null;
  await user.save();

  res.json({ success: true });
};

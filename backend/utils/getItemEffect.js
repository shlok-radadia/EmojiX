import UserItem from "../models/UserItem.js";

export async function getActiveItemEffect(user) {
  if (!user.equippedItem) {
    return null;
  }

  const equipped = await UserItem.findById(user.equippedItem)
    .populate("item")
    .lean();

  return equipped?.item || null;
}

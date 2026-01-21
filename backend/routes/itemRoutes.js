import express from "express";
import { equipItem, unequipItem } from "../controllers/itemController.js";
import UserItem from "../models/UserItem.js";
import { protect } from "../middleware/auth.js";
import ItemCatalog from "../models/ItemCatalog.js";

const router = express.Router();

/* INVENTORY */
router.get("/", protect, async (req, res) => {
  const items = await UserItem.find({ owner: req.user.id })
    .populate("item")
    .lean();

  res.json({
    items: items.map((i) => ({
      userItemId: i._id,
      name: i.item.name,
      icon: i.item.icon,
      price: i.item.price,
      effect: i.item.effect,
      description: i.item.description,
      equipped: i.equipped,
    })),
    itemsDataForMarket: items,
  });
});

/* EQUIP / UNEQUIP */
router.post("/equip", protect, equipItem);
router.post("/unequip", protect, unequipItem);

export default router;

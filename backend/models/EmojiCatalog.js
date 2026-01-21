import mongoose from "mongoose";

const emojiCatalogSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      index: true, // 🔥 enables fast search
    },

    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Epic", "Mythic", "Legendary"],
      required: true,
    },

    biomes: {
      type: [String], // ["Grass", "Water"]
      required: true,
    },

    lore: {
      type: String,
      required: true,
    },

    // Optional fine-tuning for special emojis
    catchChanceOverride: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    catchCostOverride: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { timestamps: true }
);

const EmojiCatalog = mongoose.model("EmojiCatalog", emojiCatalogSchema);

export default EmojiCatalog;

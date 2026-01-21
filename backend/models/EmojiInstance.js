import mongoose from "mongoose";

const emojiInstanceSchema = new mongoose.Schema(
  {
    emoji: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmojiCatalog",
      required: true,
    },

    rarity: {
      type: String,
      required: true,
    },

    variant: {
      type: String,
      enum: ["Normal", "Shiny", "Alpha", "Corrupted"],
      default: "Normal",
    },

    finalRarity: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lockedForTrade: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const EmojiInstance = mongoose.model("EmojiInstance", emojiInstanceSchema);

export default EmojiInstance;

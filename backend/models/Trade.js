import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emojiInstance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmojiInstance",
      required: true,
      unique: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Trade", tradeSchema);

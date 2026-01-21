import mongoose from "mongoose";

const userItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCatalog",
      required: true,
    },

    equipped: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userItemSchema.index({ owner: 1, item: 1 }, { unique: true });

export default mongoose.model("UserItem", userItemSchema);

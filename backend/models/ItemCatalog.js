import mongoose from "mongoose";

const itemCatalogSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },

    price: { type: Number, required: true },

    effect: {
      type: {
        type: String,
        enum: [
          "spawn_rate",
          "coin_per_step",
          "coin_bonus_on_move",
          "catch_chance",
        ],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },

    description: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("ItemCatalog", itemCatalogSchema);

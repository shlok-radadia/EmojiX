import mongoose from "mongoose";

const questCatalogSchema = new mongoose.Schema({
  key: { type: String, unique: true },

  type: {
    type: String,
    enum: ["MOVE", "CATCH", "SELL"],
    required: true,
  },

  target: {
    type: Number,
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Epic"],
    required: true,
  },

  rewardCoins: {
    type: Number,
    required: true,
  },

  title: String,
  description: String,
});

export default mongoose.model("QuestCatalog", questCatalogSchema);

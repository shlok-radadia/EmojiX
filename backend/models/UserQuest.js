import mongoose from "mongoose";

const userQuestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    quest: { type: mongoose.Schema.Types.ObjectId, ref: "QuestCatalog" },

    progress: { type: Number, default: 0 },

    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("UserQuest", userQuestSchema);

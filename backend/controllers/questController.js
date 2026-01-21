import User from "../models/User.js";
import UserQuest from "../models/UserQuest.js";
import { ensureActiveQuests } from "../utils/assignQuests.js";
import { flushQuestProgress } from "../utils/flushQuestProgress.js";

export const getQuests = async (req, res) => {
  const user = await User.findById(req.user.id);
  await flushQuestProgress(user);
  await user.save();

  await ensureActiveQuests(user._id);

  const quests = await UserQuest.find({
    user: user._id,
    completed: false,
  }).populate("quest");

  res.json({ quests });
};

export const rerollQuest = async (req, res) => {
  const { userQuestId } = req.body;
  const REROLL_COST = 100;

  const user = await User.findById(req.user.id);
  if (user.coins < REROLL_COST)
    return res.status(400).json({ message: "Not enough coins" });

  await UserQuest.findByIdAndDelete(userQuestId);
  user.coins -= REROLL_COST;

  await ensureActiveQuests(user._id);
  await user.save();

  res.json({ success: true, coins: user.coins });
};

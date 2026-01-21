import UserQuest from "../models/UserQuest.js";

export async function flushQuestProgress(user) {
  const active = await UserQuest.find({
    user: user._id,
    completed: false,
  }).populate("quest");

  for (const uq of active) {
    if (uq.quest.type === "MOVE") uq.progress += user.questProgressBuffer.move;
    if (uq.quest.type === "CATCH")
      uq.progress += user.questProgressBuffer.catch;
    if (uq.quest.type === "SELL") uq.progress += user.questProgressBuffer.sell;

    if (uq.progress >= uq.quest.target) {
      uq.completed = true;
      user.coins += uq.quest.rewardCoins;
    }

    await uq.save();
  }

  user.questProgressBuffer = { move: 0, catch: 0, sell: 0 };
}

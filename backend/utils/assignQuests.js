import QuestCatalog from "../models/QuestCatalog.js";
import UserQuest from "../models/UserQuest.js";

export async function ensureActiveQuests(userId) {
  const active = await UserQuest.find({
    user: userId,
    completed: false,
  });

  if (active.length >= 3) return;

  const needed = 3 - active.length;

  const existingQuestIds = active.map((q) => q.quest);

  const pool = await QuestCatalog.find({
    _id: { $nin: existingQuestIds },
  });

  const shuffled = pool.sort(() => 0.5 - Math.random());

  const toAdd = shuffled.slice(0, needed);

  await UserQuest.insertMany(
    toAdd.map((q) => ({
      user: userId,
      quest: q._id,
    })),
  );
}

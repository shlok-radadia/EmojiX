import { useEffect, useState } from "react";
import api from "../api/axios";

/* ================= STYLES ================= */

const difficultyColor = {
  Easy: "bg-green-500/15 text-green-300",
  Medium: "bg-blue-500/15 text-blue-300",
  Hard: "bg-purple-500/15 text-purple-300",
  Epic: "bg-pink-500/20 text-pink-300",
};

const typeIcon = {
  MOVE: "🚶",
  CATCH: "🎯",
  SELL: "💰",
};

const REROLL_COST = 100;

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [message, setMessage] = useState("");
  const [confirmReroll, setConfirmReroll] = useState(null);

  useEffect(() => {
    loadQuests();
    api.get("/auth/me").then((res) => setCoins(res.data.coins ?? 0));
  }, []);

  const loadQuests = async () => {
    const res = await api.get("/quests");
    setQuests(res.data.quests || []);
  };

  const reroll = async (userQuestId) => {
    try {
      const res = await api.post("/quests/reroll", { userQuestId });
      setCoins(res.data.coins);
      setMessage("🔄 Quest rerolled");
      setConfirmReroll(null);
      loadQuests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reroll");
    }
  };

  return (
    <div className="h-full bg-[#0f0f12] text-white flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-5 border-b border-[#1f1f2a] flex justify-between">
        <h1 className="text-2xl font-semibold">📜 Quests</h1>
        <div className="text-sm text-gray-400">
          Coins <span className="text-amber-400">{coins}</span>
        </div>
      </div>

      {message && (
        <div className="px-8 py-2 text-sm text-indigo-300">{message}</div>
      )}

      {/* QUEST LIST */}
      <div className="flex-1 overflow-y-auto px-8 py-6 grid gap-5">
        {quests.map((q) => {
          const progress = Math.min(
            100,
            Math.floor((q.progress / q.quest.target) * 100),
          );

          return (
            <div
              key={q._id}
              className="rounded-2xl bg-[#141418] border border-[#24242c] p-5 flex flex-col gap-3"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="text-2xl">{typeIcon[q.quest.type]}</div>

                  <div>
                    <div className="font-medium">{q.quest.title}</div>
                    <div className="text-xs text-gray-400">
                      {q.quest.description}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${difficultyColor[q.quest.difficulty]}`}
                >
                  {q.quest.difficulty}
                </span>
              </div>

              {/* PROGRESS */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>
                    {q.progress} / {q.quest.target}
                  </span>
                  <span>{progress}%</span>
                </div>

                <div className="h-2 bg-black/40 rounded overflow-hidden">
                  <div
                    className="h-2 bg-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-amber-400">
                  🪙 {q.quest.rewardCoins}
                </div>

                {confirmReroll === q._id ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-[11px] text-amber-400 text-center">
                      💰 Costs {REROLL_COST} coins
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={coins < REROLL_COST}
                        onClick={() => reroll(q._id)}
                        className={`text-xs px-3 py-1 rounded-md transition
        ${
          coins < REROLL_COST
            ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-400"
        }`}
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => setConfirmReroll(null)}
                        className="text-xs px-3 py-1 rounded-md
        bg-gray-600/40 hover:bg-gray-600/60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReroll(q._id)}
                    className="text-xs px-3 py-1 rounded-md
    bg-red-500/15 hover:bg-red-500/25 text-red-300"
                  >
                    Reroll
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {quests.length === 0 && (
          <div className="text-gray-500 text-sm">No active quests</div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const biomeIcon = {
  Grass: "🌿",
  Forest: "🌲",
  Desert: "🌵",
  Swamp: "🌫️",
  Water: "🌊",
  Snow: "❄️",
  Volcano: "🌋",
};

const VARIANT_ORDER = ["Normal", "Shiny", "Alpha", "Corrupted"];

const rarityTheme = {
  Common: "border-gray-500/40",
  Uncommon: "border-green-500/40",
  Rare: "border-blue-500/40",
  Epic: "border-purple-500/40",
  Mythic: "border-pink-500/40",
  Legendary: "border-yellow-400/50",
};

const variantBadge = {
  Normal: "bg-gray-600/40",
  Shiny: "bg-cyan-400/30 text-cyan-200",
  Alpha: "bg-red-500/30 text-red-200",
  Corrupted: "bg-purple-700/40 text-purple-200",
};

export default function EmojiDex() {
  const [dex, setDex] = useState([]);
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `EmojiDex`;
    api.get("/dex").then((res) => {
      setDex(res.data.dex);
      setProgress(res.data.progress);
    });
  }, []);

  if (!progress) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading EmojiDex...
      </div>
    );
  }

  const completion =
    Math.round((progress.discovered / progress.total) * 100) || 0;

  return (
    <div className="h-full flex bg-[#0f0f12] text-white overflow-hidden">
      <aside className="w-[300px] shrink-0 border-r border-[#222] bg-[#111115] p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">EmojiDex</h1>
          <p className="text-xs text-gray-400 mt-1">Your emoji collection</p>
        </div>

        <div className="bg-[#141418] border border-[#222] rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#222"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#6366f1"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={(1 - completion / 100) * 2 * Math.PI * 24}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {completion}%
              </div>
            </div>

            <div className="text-sm">
              <div className="text-gray-400 text-xs">Discovered</div>
              <div className="font-medium">
                {progress.discovered} / {progress.total}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(progress.rarity).map(([rarity, data]) => (
            <div key={rarity}>
              <div className="flex justify-between text-xs mb-1">
                <span>{rarity}</span>
                <span className="text-gray-400">
                  {data.discovered}/{data.total}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded">
                <div
                  className="h-2 rounded bg-indigo-500"
                  style={{
                    width: `${(data.discovered / data.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#222]">
          <div className="text-xs text-gray-400 mb-2">Biome Discovery</div>
          {Object.entries(progress.biomes).map(([biome, data]) => (
            <div key={biome} className="flex justify-between text-xs mb-1">
              <span>{biome}</span>
              <span className="text-gray-500">
                {data.discovered}/{data.total}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {dex.map((emoji) => (
            <div
              key={emoji.id}
              onClick={() => navigate(`/dex/${emoji.id}`)}
              className={`
                h-[180px] rounded-xl border bg-[#141418]
                px-3 py-3 flex flex-col items-center
                transition-all duration-200 cursor-pointer
                hover:-translate-y-1 hover:shadow-lg
                ${rarityTheme[emoji.rarity]}
                ${!emoji.discovered && "opacity-40 grayscale"}
              `}
            >
              <div className="w-13 h-13 flex items-center justify-center rounded-lg bg-black/30 text-3xl select-none">
                {emoji.discovered ? emoji.symbol : "❓"}
              </div>

              <div
                className="mt-1.5 text-xs font-medium text-center truncate w-full"
                title={emoji.discovered ? emoji.name : "Undiscovered"}
              >
                {emoji.discovered ? emoji.name : "?????"}
              </div>

              <div className="mt-1.5 flex gap-1 text-xs opacity-80">
                {emoji.biomes.map((b) => (
                  <span key={b} title={b}>
                    {biomeIcon[b]}
                  </span>
                ))}
              </div>

              <div className="mt-1.5 min-h-[32px] flex items-center justify-center">
                {emoji.discovered && emoji.variants?.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1">
                    {VARIANT_ORDER.filter((v) =>
                      emoji.variants.includes(v),
                    ).map((v) => (
                      <span
                        key={v}
                        className={`px-2 py-0.5 text-[10px] rounded-full ${variantBadge[v]}`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600">—</span>
                )}
              </div>

              <div className="flex-1" />

              <div className="text-[10px] text-gray-500">
                {emoji.discovered
                  ? `Collected ×${emoji.count}`
                  : "Undiscovered"}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

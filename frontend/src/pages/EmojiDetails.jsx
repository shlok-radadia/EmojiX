import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const RARITY_ORDER = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Mythic",
  "Legendary",
];

const VARIANT_ORDER = ["Normal", "Shiny", "Alpha", "Corrupted"];

const variantUI = {
  Normal: {
    badge: "bg-gray-600/30 text-gray-200",
  },
  Shiny: {
    badge: "bg-cyan-400/20 text-cyan-300",
  },
  Alpha: {
    badge: "bg-red-500/20 text-red-300",
  },
  Corrupted: {
    badge: "bg-purple-700/30 text-purple-300",
  },
};

const rarityStyle = {
  Common: {
    ring: "ring-gray-500/40",
    glow: "shadow-gray-500/20",
    badge: "bg-gray-500/15 text-gray-300",
    bg: "from-gray-500/10 to-transparent",
  },
  Uncommon: {
    ring: "ring-green-500/40",
    glow: "shadow-green-500/30",
    badge: "bg-green-500/15 text-green-400",
    bg: "from-green-500/10 to-transparent",
  },
  Rare: {
    ring: "ring-blue-500/40",
    glow: "shadow-blue-500/30",
    badge: "bg-blue-500/15 text-blue-400",
    bg: "from-blue-500/10 to-transparent",
  },
  Epic: {
    ring: "ring-purple-500/40",
    glow: "shadow-purple-500/40",
    badge: "bg-purple-500/15 text-purple-400",
    bg: "from-purple-500/10 to-transparent",
  },
  Mythic: {
    ring: "ring-pink-500/40",
    glow: "shadow-pink-500/40",
    badge: "bg-pink-500/15 text-pink-400",
    bg: "from-pink-500/10 to-transparent",
  },
  Legendary: {
    ring: "ring-yellow-400/50",
    glow: "shadow-yellow-400/40",
    badge: "bg-yellow-400/20 text-yellow-300",
    bg: "from-yellow-400/10 to-transparent",
  },
};

const biomeIcon = {
  Grass: "🌿",
  Forest: "🌲",
  Desert: "🌵",
  Swamp: "🌫️",
  Water: "🌊",
  Snow: "❄️",
  Volcano: "🌋",
};

export default function EmojiDetails() {
  const { emojiId } = useParams();
  const navigate = useNavigate();
  const [emoji, setEmoji] = useState(null);

  useEffect(() => {
    api.get(`/dex/${emojiId}`).then((res) => {
      setEmoji(res.data);
      if (res.data?.name) {
        document.title = `${
          res.data.discovered ? res.data.name : "?????"
        } • EmojiDex`;
      }
    });
  }, [emojiId]);

  if (!emoji) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading emoji…
      </div>
    );
  }

  const style = rarityStyle[emoji.rarity] || rarityStyle.Common;

  const renderLore = (lore, discovered) => {
    if (!lore) return "—";
    if (discovered) return lore;
    return lore.replace(/[^\s]/g, "█");
  };

  const getVariantCount = (arr, variant) =>
    arr?.find((v) => v._id === variant)?.count || 0;

  return (
    <div className="min-h-full bg-[#0f0f12] text-white flex items-center justify-center px-4 overflow-auto overflow-x-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`relative rounded-3xl bg-gradient-to-b ${style.bg}
          ring-2 ${style.ring} shadow-2xl ${style.glow}
          flex items-center justify-center`}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            ← Back
          </button>

          <div className="text-[6.5rem] select-none">
            {emoji.discovered ? emoji.symbol : "❓"}
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[calc(100vh-2rem)] overflow-auto">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}
            >
              {emoji.rarity}
            </span>
            <h1 className="text-3xl font-semibold mt-2">
              {emoji.discovered ? emoji.name : "Unknown Entry"}
            </h1>
          </div>

          <div>
            <div className="text-xs text-gray-400 mb-1">Found In</div>
            <div className="flex gap-1 flex-wrap">
              {emoji.biomes.map((b) => (
                <span
                  key={b}
                  className={`px-2 py-0.5 rounded-full text-xs bg-[#141418] border border-[#222]
                  ${emoji.discovered ? "opacity-90" : "opacity-30 grayscale"}`}
                >
                  {biomeIcon[b]} {b}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat label="Caught (You)" value={emoji.count} />
            <Stat label="Caught (Global)" value={emoji.totalCaught} />
            <Stat
              label="Status"
              value={emoji.discovered ? "Discovered" : "Undiscovered"}
            />
            <Stat
              label="First Found"
              value={
                emoji.firstDiscoveredAt
                  ? new Date(emoji.firstDiscoveredAt).toLocaleDateString()
                  : "—"
              }
            />
          </div>

          <div className="rounded-xl bg-[#141418] border border-[#222] p-3">
            <p className="text-sm font-medium text-gray-300 mb-3">Variants</p>

            <div className="space-y-1">
              {VARIANT_ORDER.map((v) => (
                <div
                  key={v}
                  className="flex justify-between items-center text-xs"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${variantUI[v].badge}`}
                  >
                    {v}
                  </span>

                  <div className="text-xs text-gray-400">
                    You: {getVariantCount(emoji.variants?.user, v)} | Global:{" "}
                    {getVariantCount(emoji.variants?.global, v)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#141418] border border-[#222] p-5">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-gray-300">Lore</p>
              {!emoji.discovered && (
                <span className="text-xs text-yellow-400">🔒 Locked</span>
              )}
            </div>
            <p
              className={`text-sm leading-relaxed max-h-[4.25rem] overflow-hidden ${
                emoji.discovered
                  ? "text-gray-300"
                  : "text-gray-500 tracking-widest select-none"
              }`}
            >
              {renderLore(emoji.lore, emoji.discovered)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-[#141418] border border-[#222] p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="font-medium">{value ?? "—"}</div>
    </div>
  );
}

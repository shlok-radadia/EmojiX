import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

/* ================= CONFIG ================= */

const VIEW = 17;
const HALF = Math.floor(VIEW / 2);
const REGION_SIZE = 4;

/* ================= BIOMES ================= */

const noise2D = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const getBiome = (x, y) => {
  const rx = Math.floor(x / REGION_SIZE);
  const ry = Math.floor(y / REGION_SIZE);
  const scale = REGION_SIZE / 12;

  const n1 = noise2D(rx * 0.08 * scale, ry * 0.08 * scale);
  const n2 = noise2D(rx * 0.02 * scale + 100, ry * 0.02 * scale + 100);
  const n = n1 * 0.7 + n2 * 0.3;

  const volcanoNoise = noise2D(
    rx * 0.01 * scale + 999,
    ry * 0.01 * scale + 999,
  );

  if (volcanoNoise > 0.985) return "Volcano";
  if (n < 0.18) return "Water";
  if (n < 0.28) return "Swamp";
  if (n < 0.42) return "Grass";
  if (n < 0.58) return "Forest";
  if (n < 0.72) return "Desert";
  return "Snow";
};

/* ================= UI THEMES ================= */

const biomeTile = {
  Grass: "bg-green-600",
  Forest: "bg-emerald-700",
  Desert: "bg-yellow-500",
  Swamp: "bg-lime-900",
  Water: "bg-blue-600",
  Snow: "bg-slate-300",
  Volcano: "bg-red-800",
};

const rarityUI = {
  Common: "bg-gray-500/10 border-gray-500/40",
  Uncommon: "bg-green-500/10 border-green-500/40",
  Rare: "bg-blue-500/15 border-blue-500/50",
  Epic: "bg-purple-500/20 border-purple-500/60",
  Mythic: "bg-pink-500/25 border-pink-500/70",
  Legendary:
    "bg-gradient-to-br from-yellow-400/25 to-amber-600/20 border-yellow-400/80",
};

const variantUI = {
  Normal: {
    ring: "ring-gray-400/30",
    badge: "bg-gray-600/30 text-gray-200",
    glow: "",
  },
  Shiny: {
    ring: "ring-cyan-400/80",
    badge: "bg-cyan-400/20 text-cyan-300",
    glow: "shadow-[0_0_25px_rgba(34,211,238,0.45)]",
  },
  Alpha: {
    ring: "ring-red-500/90",
    badge: "bg-red-500/20 text-red-300",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.5)]",
  },
  Corrupted: {
    ring: "ring-purple-700/90",
    badge: "bg-purple-700/30 text-purple-300",
    glow: "shadow-[0_0_35px_rgba(126,34,206,0.6)]",
  },
};

const biomeDecor = {
  Grass: ["🌿", "🌱", ""],
  Forest: ["🌲", "🍄", ""],
  Desert: ["🌵", "🪨", ""],
  Swamp: ["🦠", "🌫️", ""],
  Water: ["🌊", "💧", ""],
  Snow: ["❄️", "⛄", ""],
  Volcano: ["🌋", "🔥", ""],
};

const effectText = {
  spawn_rate: "Spawn Chance",
  coin_per_step: "Coins / Step",
  coin_bonus_on_move: "Bonus Coins",
  catch_chance: "Catch Chance",
};

/* ================= GAME ================= */

export default function Game() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState(0);
  const [biome, setBiome] = useState("Grass");

  const [encounter, setEncounter] = useState(null);
  const [message, setMessage] = useState("");
  const [isMoving, setIsMoving] = useState(false);
  const [isCatching, setIsCatching] = useState(false);

  const [claimedToday, setClaimedToday] = useState(false);
  const [equippedItem, setEquippedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `EmojiX`;
    api.get("/auth/me").then((res) => {
      setEquippedItem(res.data.equippedItem);
      setPosition(res.data.position || { x: 0, y: 0 });
      setCoins(res.data.coins ?? 0);
      setBiome(getBiome(res.data.position.x, res.data.position.y));
      if (res.data.lastDailyClaim) {
        const today = new Date().toDateString();
        const last = new Date(res.data.lastDailyClaim).toDateString();
        const isClaimed = today === last;
        setClaimedToday(isClaimed);
      }
      setLoading(false);
    });
  }, []);

  /* ================= MOVE ================= */

  const move = async (direction) => {
    if (isMoving) return;
    setIsMoving(true);
    setMessage("");

    try {
      const res = await api.post("/game/move", { direction });

      setPosition(res.data.position);
      setBiome(res.data.biome);
      setEncounter(res.data.spawned ? res.data.emoji : null);

      if (typeof res.data.coins === "number") {
        setCoins(res.data.coins);
      }

      // ✅ EXPLORATION COIN REWARD
      if (res.data.explorationReward > 0) {
        const total = res.data.explorationReward + (res.data.bonusReward || 0);

        setMessage(
          res.data.bonusReward
            ? `🪙 +${res.data.explorationReward} (+${res.data.bonusReward} bonus)`
            : `🪙 +${res.data.explorationReward} coins`,
        );
      }
    } finally {
      setIsMoving(false);
    }
  };

  const handleKey = useCallback((e) => {
    if (e.repeat) return;
    if (e.key === "ArrowUp" || e.key === "w") move("UP");
    if (e.key === "ArrowDown" || e.key === "s") move("DOWN");
    if (e.key === "ArrowLeft" || e.key === "a") move("LEFT");
    if (e.key === "ArrowRight" || e.key === "d") move("RIGHT");
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* ================= CATCH ================= */

  const catchEmoji = async () => {
    if (!encounter || isCatching) return;
    setIsCatching(true);

    try {
      const res = await api.post("/game/catch", {
        emojiId: encounter.id,
        variant: encounter.variant,
      });

      setCoins(res.data.coins);
      setMessage(
        res.data.success
          ? `✨ Caught ${res.data.emoji.name}!`
          : "💨 Emoji escaped!",
      );

      setEncounter(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong");
      setEncounter(null);
    } finally {
      setIsCatching(false);
    }
  };

  /* ================= DAILY ================= */

  const claim = async () => {
    const res = await api.post("/daily/claim");
    setCoins(res.data.coins);
    // setClaimed(true);
    setClaimedToday(true); // 🔥 THIS is the key
    setMessage("🎁 Daily bonus claimed!");
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-[1fr_360px] bg-[#0f0f12] text-white">
      <div className="flex items-center justify-center">
        <Map position={position} />
      </div>

      <div className="p-5 flex flex-col gap-5 border-l border-[#222] bg-[#141418]">
        {equippedItem && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3">
            <div className="text-xs text-indigo-300 mb-1">Equipped Item</div>

            <div className="flex items-center gap-3">
              <div className="text-3xl">{equippedItem.icon}</div>

              <div>
                <div className="font-medium">{equippedItem.name}</div>
                <div className="text-xs text-gray-400">
                  +{equippedItem.effect.value}
                  {equippedItem.effect.type === "catch_chance" ||
                  equippedItem.effect.type === "spawn_rate"
                    ? "%"
                    : ""}{" "}
                  {effectText[equippedItem.effect.type]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ DAILY ONLY IF NOT CLAIMED */}
        {!loading && !claimedToday && (
          <div className="rounded-xl bg-[#141418] border border-[#222] p-4">
            <div className="text-sm font-medium mb-2">🎁 Daily Bonus</div>
            <button
              onClick={claim}
              className="w-full py-1 rounded-md bg-indigo-500 hover:bg-indigo-400"
            >
              Claim +50 Coins
            </button>
          </div>
        )}

        <div className="text-sm text-gray-400 space-y-1">
          <div>
            Position: ({position.x}, {position.y})
          </div>
          <div>
            Coins: <span className="text-amber-400">{coins}</span>
          </div>
          <div>Biome: {biome}</div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {encounter ? (
            <div
              className={`w-full p-5 rounded-xl border-2 text-center
                ${rarityUI[encounter.rarity]}
                ring-2 ${variantUI[encounter.variant]?.ring}
                ${variantUI[encounter.variant]?.glow}`}
            >
              <div
                className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold
                ${variantUI[encounter.variant]?.badge}`}
              >
                {encounter.variant}
              </div>

              <div className="text-6xl mb-2">{encounter.symbol}</div>

              <div className="text-sm text-gray-400">{encounter.name}</div>

              <div className="font-semibold mb-4">{encounter.rarity}</div>

              <button
                disabled={isCatching}
                onClick={catchEmoji}
                className="w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50"
              >
                Catch
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              {message || "No emoji encountered"}
            </div>
          )}
        </div>

        <Controls move={move} />
      </div>
    </div>
  );
}

/* ================= MAP ================= */

function Map({ position }) {
  const cells = [];

  for (let y = -HALF; y <= HALF; y++) {
    for (let x = -HALF; x <= HALF; x++) {
      const wx = position.x + x;
      const wy = position.y - y;
      const biome = getBiome(wx, wy);
      const decor =
        biomeDecor[biome][
          Math.abs(wx * 31 + wy * 17) % biomeDecor[biome].length
        ];
      const isPlayer = x === 0 && y === 0;

      cells.push(
        <div
          key={`${wx},${wy}`}
          className={`w-8 h-8 flex items-center justify-center ${biomeTile[biome]}`}
        >
          {!isPlayer && <span className="text-xs opacity-60">{decor}</span>}
          {isPlayer && <span className="text-2xl">🧍</span>}
        </div>,
      );
    }
  }

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${VIEW}, 2rem)` }}
    >
      {cells}
    </div>
  );
}

/* ================= CONTROLS ================= */

function Controls({ move }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-3 gap-2">
        <div />
        <Arrow onClick={() => move("UP")}>↑</Arrow>
        <div />
        <Arrow onClick={() => move("LEFT")}>←</Arrow>
        <div />
        <Arrow onClick={() => move("RIGHT")}>→</Arrow>
        <div />
        <Arrow onClick={() => move("DOWN")}>↓</Arrow>
        <div />
      </div>
      <div className="text-xs text-gray-500">WASD / Arrow Keys</div>
    </div>
  );
}

function Arrow({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-md bg-[#1f1f25] hover:bg-[#2a2a32] border border-[#2f2f38] cursor-pointer"
    >
      {children}
    </button>
  );
}

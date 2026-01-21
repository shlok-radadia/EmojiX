import { useEffect, useState } from "react";
import api from "../api/axios";

/* ================= CONFIG ================= */

const VARIANTS = ["Normal", "Shiny", "Alpha", "Corrupted"];
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Mythic", "Legendary"];
const BIOMES = [
  "Grass",
  "Forest",
  "Desert",
  "Swamp",
  "Water",
  "Snow",
  "Volcano",
];

const rarityGlow = {
  Common: "ring-1 ring-gray-500/20",
  Uncommon:
    "ring-1 ring-green-400/30 shadow-[0_0_12px_2px_rgba(34,197,94,0.15)]",
  Rare: "ring-1 ring-blue-400/40 shadow-[0_0_14px_3px_rgba(59,130,246,0.25)]",
  Epic: "ring-1 ring-purple-400/50 shadow-[0_0_18px_4px_rgba(168,85,247,0.35)]",
  Mythic: "ring-1 ring-pink-400/50 shadow-[0_0_22px_5px_rgba(236,72,153,0.4)]",
  Legendary:
    "ring-1 ring-yellow-300/60 shadow-[0_0_28px_6px_rgba(250,204,21,0.5)]",
};

const variantBadge = {
  Normal: "bg-gray-700/70 text-gray-200 ring-1 ring-gray-500/30",
  Shiny:
    "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.4)]",
  Alpha:
    "bg-red-500/20 text-red-300 ring-1 ring-red-400/40 shadow-[0_0_12px_rgba(248,113,113,0.45)]",
  Corrupted:
    "bg-purple-700/30 text-purple-200 ring-1 ring-purple-500/50 shadow-[0_0_14px_rgba(168,85,247,0.6)]",
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

/* ================= COMPONENT ================= */

export default function EmojiInventory() {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [filters, setFilters] = useState({
    rarity: "",
    variant: "",
    biome: "",
  });
  const [search, setSearch] = useState("");
  const [sellConfirm, setSellConfirm] = useState(null);
  const [tradeConfirm, setTradeConfirm] = useState(null);

  const loadInventory = async () => {
    const params = new URLSearchParams({
      ...filters,
      search,
    });
    const res = await api.get(`/inventory/emojis?${params.toString()}`);
    setItems(res.data.items || []);
  };

  useEffect(() => {
    document.title = `Emojis`;
    api.get("/auth/me").then((res) => setCoins(res.data.coins ?? 0));
    loadInventory();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [filters, search]);

  const sellEmoji = async (instanceId) => {
    await api.post("/inventory/sell", { instanceId });
    loadInventory();
    api.get("/auth/me").then((res) => setCoins(res.data.coins ?? 0));
  };

  return (
    <div className="h-full bg-[#0f0f12] text-white flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-5 flex justify-between items-center border-b border-[#1f1f2a]">
        <h1 className="text-2xl font-semibold tracking-tight">
          Emoji Inventory
        </h1>
        <div className="text-sm text-gray-400">
          Coins <span className="ml-1 text-amber-400 font-medium">{coins}</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="px-8 py-3 flex gap-3 border-b border-[#1f1f2a] text-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji name…"
          className="bg-[#14141c] border border-[#262636]
            rounded-md px-3 py-1.5 text-xs w-48"
        />

        <Filter
          label="Rarity"
          options={RARITIES}
          value={filters.rarity}
          onChange={(v) => setFilters({ ...filters, rarity: v })}
        />
        <Filter
          label="Variant"
          options={VARIANTS}
          value={filters.variant}
          onChange={(v) => setFilters({ ...filters, variant: v })}
        />
        <Filter
          label="Biome"
          options={BIOMES}
          value={filters.biome}
          onChange={(v) => setFilters({ ...filters, biome: v })}
        />
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {sellConfirm && (
          <div className="mb-4 rounded-xl bg-[#14141c] border border-red-500/30 p-4 flex justify-between items-center">
            <div className="text-sm">
              Sell <span className="font-medium">{sellConfirm.name}</span>?
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSellConfirm(null)}
                className="px-3 py-1.5 text-xs rounded-md bg-gray-600/30 hover:bg-gray-600/40"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await sellEmoji(sellConfirm.instanceId);
                  setSellConfirm(null);
                }}
                className="px-3 py-1.5 text-xs rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        )}

        {tradeConfirm && (
          <div className="mb-4 rounded-xl bg-[#14141c] border border-indigo-500/30 p-4">
            <div className="text-sm mb-3">
              Put <span className="font-medium">{tradeConfirm.name}</span> for
              trade?
            </div>

            <input
              type="number"
              placeholder="Set price"
              className="w-full mb-3 bg-[#0f0f12] border border-[#262636]
      rounded-md px-3 py-1.5 text-xs"
              onChange={(e) =>
                setTradeConfirm({
                  ...tradeConfirm,
                  price: Number(e.target.value),
                })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={() => setTradeConfirm(null)}
                className="px-3 py-1.5 text-xs rounded-md bg-gray-600/30"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await api.post("/trades/create", {
                    instanceId: tradeConfirm.instanceId,
                    price: tradeConfirm.price,
                  });
                  setTradeConfirm(null);
                  loadInventory();
                }}
                disabled={!tradeConfirm.price || tradeConfirm.price <= 0}
                className="px-3 py-1.5 text-xs rounded-md
        bg-indigo-500/20 hover:bg-indigo-500/30
        text-indigo-300 disabled:opacity-50"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-gray-500 text-sm">
            No emojis found for selected filters.
          </div>
        )}

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          }}
        >
          {items.map((e) => (
            <div
              key={e.instanceId}
              className={`relative rounded-2xl bg-gradient-to-b from-[#161622] to-[#0e0e15] p-4 h-[260px]
              flex flex-col justify-between transition
              shadow-lg ${rarityGlow[e.finalRarity]}`}
            >
              {/* VARIANT BADGE */}
              <div
                className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px]
                ${variantBadge[e.variant]}`}
              >
                {e.variant}
              </div>

              {/* EMOJI */}
              <div
                className="text-center text-[3.2rem] select-none"
                title={e.name}
              >
                {e.symbol}
              </div>

              <div className="text-center text-sm font-medium mt-1 truncate">
                {e.name}
              </div>

              {/* RARITY */}
              <div className="text-center text-xs text-gray-400">
                {e.finalRarity}
              </div>

              {/* BIOMES */}
              <div className="flex justify-center gap-1 text-sm opacity-70">
                {e.biomes.map((b) => (
                  <span key={b} title={b}>
                    {biomeIcon[b]}
                  </span>
                ))}
              </div>

              {/* META */}
              <div className="text-[10px] text-gray-500 text-center">
                {new Date(e.caughtAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setTradeConfirm({
                      instanceId: e.instanceId,
                      name: e.name,
                    })
                  }
                  className="flex-1 py-1.5 rounded-md text-xs
    bg-indigo-500/15 hover:bg-indigo-500/25
    text-indigo-300 transition"
                >
                  Trade
                </button>

                <button
                  onClick={() =>
                    setSellConfirm({ instanceId: e.instanceId, name: e.name })
                  }
                  className="flex-1 py-1.5 rounded-md text-xs
    bg-red-500/15 hover:bg-red-500/25
    text-red-300 transition"
                >
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= FILTER ================= */

function Filter({ label, options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#14141c] border border-[#262636]
      rounded-md px-3 py-1.5 text-xs"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

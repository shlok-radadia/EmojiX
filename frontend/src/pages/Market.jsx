import { useEffect, useState } from "react";
import api from "../api/axios";

const effectLabel = {
  spawn_rate: "Spawn Chance",
  coin_per_step: "Coins / Step",
  coin_bonus_on_move: "Bonus Coins",
  catch_chance: "Catch Chance",
};

const effectValue = (effect) => {
  if (effect.type === "spawn_rate") return `+${effect.value * 100}%`;
  if (effect.type === "catch_chance") return `+${effect.value}%`;
  if (effect.type === "coin_per_step") return `+${effect.value}`;
  if (effect.type === "coin_bonus_on_move")
    return `+${effect.value} / 20 steps`;
};

export default function Market() {
  const [items, setItems] = useState([]);
  const [ownedKeys, setOwnedKeys] = useState(new Set());
  const [coins, setCoins] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = `Market`;
    loadMarket();
  }, []);

  const loadMarket = async () => {
    const [marketRes, inventoryRes, meRes] = await Promise.all([
      api.get("/market/items"),
      api.get("/items"),
      api.get("/auth/me"),
    ]);

    setCoins(meRes.data.coins ?? 0);

    const owned = new Set(
      inventoryRes.data.itemsDataForMarket.map((i) => i.item.key),
    );
    setOwnedKeys(owned);

    const filtered = marketRes.data.items.filter((i) => !owned.has(i.key));

    setItems(filtered);
  };

  const buyItem = async (itemId) => {
    try {
      const res = await api.post("/market/buy", { itemId });
      setCoins(res.data.coins);
      setMessage("✅ Item purchased successfully");
      loadMarket();
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Purchase failed");
    }
  };

  return (
    <div className="h-full bg-[#0f0f12] text-white flex flex-col overflow-hidden">
      <div className="px-8 py-5 border-b border-[#222] flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">🛒 Market</h1>
        <div className="text-sm text-gray-400">
          Coins <span className="text-amber-400 font-medium">{coins}</span>
        </div>
      </div>

      {message && (
        <div className="px-8 py-2 text-sm text-indigo-300">{message}</div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-[#2a2a32] scrollbar-track-transparent">
        {items.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No items available in market
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {items.map((item) => (
              <div
                key={item._id}
                className="relative rounded-2xl bg-[#141418] border border-[#24242c]
                p-5 flex flex-col gap-4 shadow-lg"
              >
                <div className="text-4xl text-center">{item.icon}</div>

                <div className="text-center">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </div>
                </div>

                <div className="rounded-lg bg-[#1c1c22] border border-[#2a2a32] px-3 py-2 text-xs">
                  <div className="text-gray-400">
                    {effectLabel[item.effect.type]}
                  </div>
                  <div className="text-emerald-400 font-medium">
                    {effectValue(item.effect)}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <div className="text-sm text-amber-400">🪙 {item.price}</div>

                  <button
                    onClick={() => buyItem(item._id)}
                    disabled={coins < item.price}
                    className="px-4 py-1.5 rounded-md text-xs
                    bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 transition"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

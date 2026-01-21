import { useEffect, useState } from "react";
import api from "../api/axios";

const effectLabel = {
  spawn_rate: "Spawn Chance",
  coin_per_step: "Coins / Step",
  coin_bonus_on_move: "Bonus Coins / 20 steps",
  catch_chance: "Catch Chance",
};

export default function ItemInventory() {
  const [items, setItems] = useState([]);
  const [equipped, setEquipped] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.title = `Items`;
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await api.get("/items");
    setItems(res.data.items);
    setEquipped(res.data.items.find((i) => i.equipped) || null);
  };

  const equip = async (userItemId) => {
    await api.post("/items/equip", { userItemId });
    setMessage("Item equipped");
    loadItems();
  };

  const unequip = async () => {
    await api.post("/items/unequip");
    setMessage("Item unequipped");
    loadItems();
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#0f0f12] text-white flex flex-col">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-[#222] flex justify-between">
        <h1 className="text-xl font-semibold">🎒 Items</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item…"
          className="bg-[#141418] border border-[#222]
          px-3 py-1.5 rounded-md text-sm outline-none"
        />
      </div>

      {/* EQUIPPED ITEM – FIXED */}
      <div className="px-6 py-4 border-b border-[#222] bg-[#141418]">
        <div className="text-xs text-gray-400 mb-2">Equipped Item</div>

        {equipped ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{equipped.icon}</div>

              <div>
                <div className="font-medium">{equipped.name}</div>
                <div className="text-xs text-indigo-300">
                  +{equipped.effect.value}
                  {equipped.effect.type === "catch_chance" ||
                  equipped.effect.type === "spawn_rate"
                    ? "%"
                    : ""}{" "}
                  {effectLabel[equipped.effect.type]}
                </div>
              </div>
            </div>

            <button
              onClick={unequip}
              className="text-xs px-3 py-1 rounded
              bg-red-500/20 hover:bg-red-500/30 text-red-300"
            >
              Unequip
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No item equipped</div>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="px-6 py-2 text-sm text-indigo-300">{message}</div>
      )}

      {/* INVENTORY LIST – SCROLL ONLY HERE */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-[#2a2a32]">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500 mt-6">No items found</div>
        )}

        <div className="divide-y divide-[#222]">
          {filtered.map((item) => (
            <div
              key={item.userItemId}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl w-8 text-center">{item.icon}</div>

                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-400">
                    +{item.effect.value}
                    {item.effect.type === "catch_chance" ||
                    item.effect.type === "spawn_rate"
                      ? "%"
                      : ""}{" "}
                    {effectLabel[item.effect.type]}
                  </div>
                </div>
              </div>

              {!item.equipped && (
                <button
                  onClick={() => equip(item.userItemId)}
                  className="text-xs px-4 py-1.5 rounded
                  bg-indigo-500 hover:bg-indigo-400"
                >
                  Equip
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

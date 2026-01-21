import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const rarityStyle = {
  Common: "border-gray-500/30",
  Uncommon: "border-green-500/40",
  Rare: "border-blue-500/40",
  Epic: "border-purple-500/50",
  Mythic: "border-pink-500/60",
  Legendary: "border-yellow-400/60",
};

const variantBadge = {
  Normal: "bg-gray-600/30",
  Shiny: "bg-cyan-400/20 text-cyan-300",
  Alpha: "bg-red-500/20 text-red-300",
  Corrupted: "bg-purple-700/30 text-purple-300",
};

export default function ProfileInventory() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Emojis";
  }, []);

  useEffect(() => {
    api.get(`/profile/${userId}/inventory`).then((res) => {
      setItems(res.data.items || []);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading inventory…
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#0f0f12] text-white px-6 py-6">
      <Link
        to={`/profile/${userId}/stats`}
        className="inline-flex items-center gap-2
    text-sm text-gray-400 hover:text-indigo-300
    transition mb-4"
      >
        ← Back to Profile
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          🎒 Emoji Inventory
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Emojis currently owned by this player
        </p>
      </div>

      {items.length === 0 && (
        <div className="text-gray-500 text-sm">No emojis in inventory.</div>
      )}

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {items.map((e) => (
          <div
            key={e.instanceId}
            className={`relative rounded-2xl bg-[#141418] border p-4
            flex flex-col items-center text-center
            transition hover:-translate-y-1 hover:shadow-xl
            ${rarityStyle[e.rarity]}`}
          >
            <div
              className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px]
              ${variantBadge[e.variant]}`}
            >
              {e.variant}
            </div>

            <div className="text-[3.2rem] select-none mb-2">{e.symbol}</div>

            <div className="font-medium text-sm truncate w-full">{e.name}</div>

            <div className="text-[11px] text-gray-400 mt-1">{e.rarity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

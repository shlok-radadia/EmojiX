import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

/* ================= UI CONFIG ================= */

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

/* ================= COMPONENT ================= */

export default function ProfileTrades() {
  const { userId } = useParams();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profile/${userId}/trades`).then((res) => {
      setTrades(res.data.trades || []);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading trade listings…
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

      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          🔁 Active Trade Listings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Emojis currently listed for trade by this player
        </p>
      </div>

      {/* ================= EMPTY ================= */}
      {trades.length === 0 && (
        <div className="text-gray-500 text-sm">
          This player has no active trades.
        </div>
      )}

      {/* ================= GRID ================= */}
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        }}
      >
        {trades.map((t) => (
          <div
            key={t.tradeId}
            className={`relative rounded-2xl bg-[#141418] border p-4
            flex flex-col items-center text-center
            transition hover:-translate-y-1 hover:shadow-xl
            ${rarityStyle[t.rarity]}`}
          >
            {/* VARIANT */}
            <div
              className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px]
              ${variantBadge[t.variant]}`}
            >
              {t.variant}
            </div>

            {/* EMOJI */}
            <div className="text-[3.2rem] select-none mb-2">{t.symbol}</div>

            {/* NAME */}
            <div className="font-medium text-sm truncate w-full">{t.name}</div>

            {/* META */}
            <div className="text-[11px] text-gray-400 mt-0.5">{t.rarity}</div>

            {/* PRICE */}
            <div className="mt-2 text-amber-400 text-sm font-medium">
              🪙 {t.price}
            </div>

            {/* FOOTER */}
            <div className="mt-2 text-[10px] text-gray-500">
              Listed for trade
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

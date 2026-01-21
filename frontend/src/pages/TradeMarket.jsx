import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

/* ================= CONFIG ================= */

const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Mythic", "Legendary"];
const VARIANTS = ["Normal", "Shiny", "Alpha", "Corrupted"];

const rarityStyle = {
  Common: "border-gray-500/40",
  Uncommon: "border-green-500/40",
  Rare: "border-blue-500/40",
  Epic: "border-purple-500/40",
  Mythic: "border-pink-500/40",
  Legendary: "border-yellow-400/50",
};

const variantBadge = {
  Normal: "bg-gray-600/40",
  Shiny: "bg-cyan-500/30 text-cyan-200",
  Alpha: "bg-red-500/30 text-red-200",
  Corrupted: "bg-purple-700/40 text-purple-200",
};

/* ================= COMPONENT ================= */

export default function TradeMarket() {
  const [trades, setTrades] = useState([]);
  const [coins, setCoins] = useState(0);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("");
  const [variant, setVariant] = useState("");
  const [mine, setMine] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [buyConfirm, setBuyConfirm] = useState(null);

  /* ================= LOAD ================= */

  const loadTrades = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      rarity,
      variant,
      mine,
    });

    const [tradeRes, meRes] = await Promise.all([
      api.get(`/trades?${params.toString()}`),
      api.get("/auth/me"),
    ]);

    setTrades(tradeRes.data.trades || []);
    setCoins(meRes.data.coins ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    loadTrades();
  }, [search, rarity, variant, mine]);

  /* ================= ACTIONS ================= */

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const buy = async (tradeId) => {
    try {
      const res = await api.post("/trades/buy", { tradeId });
      setCoins(res.data.coins);
      showMessage("Emoji purchased successfully", "success");
      loadTrades();
    } catch (err) {
      showMessage(err.response?.data?.message || "Purchase failed", "error");
    }
  };

  const cancel = async (tradeId) => {
    await api.post("/trades/cancel", { tradeId });
    showMessage("Listing cancelled", "success");
    loadTrades();
  };

  /* ================= UI ================= */

  return (
    <div className="h-full bg-[#0f0f12] text-white flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="px-8 py-5 border-b border-[#222] flex justify-between items-center">
        <h1 className="text-2xl font-semibold">🔁 Trade Market</h1>
        <div className="text-sm text-gray-400">
          Coins <span className="text-amber-400 font-medium">{coins}</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="px-8 py-3 flex flex-wrap gap-3 border-b border-[#222] text-sm">
        <input
          placeholder="Search emoji name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#141418] border border-[#26262f]
          rounded-md px-3 py-1.5 text-xs w-48"
        />

        <Select
          label="Rarity"
          value={rarity}
          onChange={setRarity}
          options={RARITIES}
        />
        <Select
          label="Variant"
          value={variant}
          onChange={setVariant}
          options={VARIANTS}
        />

        <label className="flex items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={mine}
            onChange={() => setMine(!mine)}
          />
          My Listings
        </label>
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`px-8 py-2 text-sm border-b
          ${
            messageType === "success"
              ? "text-green-300 bg-green-500/10 border-green-500/30"
              : "text-red-300 bg-red-500/10 border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}

      {/* GRID */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-[#2a2a32]">
        {loading && (
          <div className="text-gray-500 text-sm">Loading trades…</div>
        )}

        {!loading && trades.length === 0 && (
          <div className="text-gray-500 text-sm">No trades available.</div>
        )}

        {buyConfirm && (
          <div className="mx-8 mb-4 rounded-xl bg-[#141418] border border-indigo-500/30 p-4 flex justify-between items-center">
            <div className="text-sm">
              Buy{" "}
              <span className="font-medium">
                {buyConfirm.symbol} {buyConfirm.name}
              </span>{" "}
              for{" "}
              <span className="text-amber-400 font-medium">
                🪙 {buyConfirm.price}
              </span>
              ?
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setBuyConfirm(null)}
                className="px-3 py-1.5 text-xs rounded-md
        bg-gray-600/30 hover:bg-gray-600/40"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await buy(buyConfirm.tradeId);
                  setBuyConfirm(null);
                }}
                className="px-3 py-1.5 text-xs rounded-md
        bg-indigo-500/20 hover:bg-indigo-500/30
        text-indigo-300"
              >
                Confirm Buy
              </button>
            </div>
          </div>
        )}

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          }}
        >
          {trades.map((t) => (
            <div
              key={t.tradeId}
              className={`rounded-2xl bg-[#141418] border p-4
              flex flex-col justify-between
              transition hover:-translate-y-1 hover:shadow-xl
              ${rarityStyle[t.rarity]}`}
            >
              {/* VARIANT */}
              <div
                className={`self-end px-2 py-0.5 text-[10px] rounded-full ${variantBadge[t.variant]}`}
              >
                {t.variant}
              </div>

              {/* EMOJI */}
              <div className="text-center text-5xl mt-2 select-none">
                {t.symbol}
              </div>

              {/* NAME */}
              <div className="text-center font-medium mt-1 truncate">
                {t.name}
              </div>

              {/* RARITY */}
              <div className="text-center text-xs text-gray-400">
                {t.rarity}
              </div>

              {/* SELLER */}
              {!t.mine && t.seller && (
                <div className="text-[11px] text-gray-400 text-center mt-1">
                  Seller:{" "}
                  <Link
                    to={`/profile/${t.seller.id}/stats`}
                    className="text-indigo-400 hover:underline"
                  >
                    {t.seller.username}
                  </Link>
                </div>
              )}

              {/* PRICE */}
              <div className="text-center mt-2 text-amber-400 text-sm font-medium">
                🪙 {t.price}
              </div>

              {/* ACTION */}
              {t.mine ? (
                <button
                  onClick={() => cancel(t.tradeId)}
                  className="mt-3 py-1.5 rounded-md text-xs
                  bg-red-500/20 hover:bg-red-500/30 text-red-300"
                >
                  Cancel Listing
                </button>
              ) : (
                <button
                  disabled={coins < t.price || !!buyConfirm}
                  onClick={() =>
                    setBuyConfirm({
                      tradeId: t.tradeId,
                      name: t.name,
                      price: t.price,
                      symbol: t.symbol,
                    })
                  }
                  className="mt-3 py-1.5 rounded-md text-xs
  bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50"
                >
                  Buy
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= SELECT ================= */

function Select({ label, options, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#141418] border border-[#26262f]
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

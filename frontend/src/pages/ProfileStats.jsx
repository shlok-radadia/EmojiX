import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

const rarityColor = {
  Common: "bg-gray-400",
  Uncommon: "bg-green-400",
  Rare: "bg-blue-400",
  Epic: "bg-purple-400",
  Mythic: "bg-pink-400",
  Legendary: "bg-yellow-400",
};

export default function ProfileStats() {
  const { userId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/profile/${userId}/stats`).then((res) => {
      setData(res.data);
      document.title = `${res.data.username} • Profile`;
    });
  }, [userId]);

  if (!data) return <Loading />;

  return (
    <div className="h-full bg-[#0f0f12] text-white px-6 py-8 space-y-8 overflow-y-auto">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/30 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            {data.username}
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
              Player
            </span>
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Joined {new Date(data.joinedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">Coins</div>
          <div className="text-2xl font-semibold text-amber-400">
            🪙 {data.coins}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatGroup title="Collection">
          <Stat label="Total Emojis Owned" value={data.stats.emojisOwned} />
          <Stat label="Unique Emojis" value={data.stats.uniqueEmojis} />
        </StatGroup>

        <StatGroup title="Trading">
          <Stat
            label="Active Trade Listings"
            value={data.stats.emojisInTrade}
          />
          <Stat
            label="Inventory Available"
            value={data.stats.emojisOwned - data.stats.emojisInTrade}
          />
        </StatGroup>
      </div>

      <div className="rounded-2xl bg-[#141418] border border-[#222] p-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          Rarity Distribution
        </h2>

        <div className="space-y-3">
          {RARITY_ORDER.map((r) => {
            const count = data.stats.rarityBreakdown?.[r] || 0;
            const total = data.stats.emojisOwned || 1;
            const percent = Math.round((count / total) * 100);

            return (
              <div key={r}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{r}</span>
                  <span className="text-gray-400">{count}</span>
                </div>

                <div className="h-2 bg-black/30 rounded">
                  <div
                    className={`h-2 rounded ${rarityColor[r]}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-[#141418] border border-[#222] p-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          Variant Distribution
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VARIANT_ORDER.map((v) => (
            <div
              key={v}
              className="rounded-xl bg-black/30 border border-[#222] p-4 text-center"
            >
              <div className="text-xs text-gray-400">{v}</div>
              <div className="text-xl font-semibold mt-1">
                {data.stats.variantBreakdown?.[v] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <ProfileLink
          to={`/profile/${userId}/inventory`}
          label="View Inventory"
        />
        <ProfileLink to={`/profile/${userId}/trades`} label="View Trades" />
      </div>
    </div>
  );
}

function StatGroup({ title, children }) {
  return (
    <div className="rounded-2xl bg-[#141418] border border-[#222] p-5">
      <h2 className="text-sm font-medium text-gray-300 mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-black/30 border border-[#222] p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ProfileLink({ to, label }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-lg text-sm
      bg-[#141418] border border-[#222]
      hover:border-indigo-500/50 hover:text-indigo-300 transition"
    >
      {label}
    </Link>
  );
}

function Loading() {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      Loading profile…
    </div>
  );
}

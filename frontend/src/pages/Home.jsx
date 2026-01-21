import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    document.title = "EmojiX";
  }, []);

  return (
    <main className="h-screen bg-[#0f0f12] text-white overflow-y-auto">
      <section className="relative px-6 pt-28 pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Persistent Exploration Game
            </span>

            <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
              Explore.
              <br />
              Collect.
              <br />
              <span className="text-indigo-400">Progress naturally.</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
              EmojiX is a calm, systems-driven exploration game where every step
              matters. Discover emojis across biomes, complete quests, trade
              with players, and build your collection at your own pace.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="px-7 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400
                font-medium transition shadow-lg shadow-indigo-500/25"
              >
                Start Exploring
              </Link>

              <Link
                to="/login"
                className="px-7 py-3 rounded-lg border border-[#2f2f38]
                hover:bg-[#1f1f26] transition"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div
              className="rounded-3xl bg-gradient-to-b from-[#16161f] to-[#0d0d13]
            border border-[#222] p-6 shadow-2xl"
            >
              <div className="grid grid-cols-5 gap-3">
                {["🌱", "🌲", "🌵", "🌊", "❄️", "🔥", "🐲", "🦄", "🧙"].map(
                  (e, i) => (
                    <div
                      key={i}
                      className="aspect-square flex items-center justify-center
                      rounded-xl bg-black/30 text-2xl"
                    >
                      {e}
                    </div>
                  ),
                )}
              </div>

              <div className="mt-6 text-sm text-gray-400">
                Discover emojis across biomes, rarities & variants.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold mb-3">
              Designed as a living system
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              EmojiX isn’t about grinding. It’s about discovery, balance, and
              player-driven progression.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SystemCard
              icon="🧭"
              title="Exploration"
              desc="Infinite grid with biome-based discovery and movement rewards."
            />
            <SystemCard
              icon="📜"
              title="Quests"
              desc="Persistent quests that progress naturally as you play."
            />
            <SystemCard
              icon="🎒"
              title="Inventory & Items"
              desc="Instance-based emojis and items that modify gameplay."
            />
            <SystemCard
              icon="🔁"
              title="Trading"
              desc="Player-driven market with real scarcity and pricing."
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div
          className="max-w-4xl mx-auto rounded-3xl
          bg-gradient-to-br from-indigo-500/15 to-transparent
          border border-indigo-500/30 p-10 text-center"
        >
          <h3 className="text-3xl font-semibold mb-4">
            Start your journey today
          </h3>
          <p className="text-gray-400 mb-8">
            No timers. No pressure. Just meaningful progression.
          </p>

          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-lg
            bg-indigo-500 hover:bg-indigo-400 transition
            font-medium shadow-lg shadow-indigo-500/30"
          >
            Create your account
          </Link>
        </div>
      </section>
    </main>
  );
}

function SystemCard({ icon, title, desc }) {
  return (
    <div
      className="rounded-2xl bg-[#141418] border border-[#222]
      p-6 flex flex-col gap-3
      hover:-translate-y-1 hover:border-indigo-500/40
      transition"
    >
      <div className="text-2xl">{icon}</div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

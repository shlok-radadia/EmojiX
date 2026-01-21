import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    document.title = `EmojiX`;
  }, []);

  return (
    <main className="pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <section className="max-w-2xl mb-20">
          <h1 className="text-5xl font-semibold leading-tight mb-6">
            Explore. Collect.
            <br />
            Progress naturally.
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            EmojiX is a grid-based exploration game where every move can reveal
            a new emoji. Discover rare finds, manage your inventory, and grow
            your coin balance at your own pace.
          </p>

          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-400"
            >
              Start exploring
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-[#3a3a42] rounded-md hover:bg-[#2a2a31]"
            >
              Login
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-8">
          <Feature
            title="Calm exploration"
            desc="Move across the grid without pressure. Each step is meaningful."
          />
          <Feature
            title="Balanced rarity"
            desc="Emojis range from Common to Legendary with fair progression."
          />
          <Feature
            title="Healthy economy"
            desc="Catch emojis, sell them for coins, and plan your next move."
          />
        </section>
      </div>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-[#2a2a31] p-6 rounded-lg border border-[#34343c]">
      <h3 className="text-lg font-medium mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

export const itemCatalogSeed = [
  {
    key: "rusty_boots",
    name: "Rusty Boots",
    icon: "🥾",
    price: 150,
    description: "Gain +1 coin every 20 steps",
    effect: { type: "coin_bonus_on_move", value: 1 },
  },

  {
    key: "wanderer_pouch",
    name: "Wanderer Pouch",
    icon: "🪙",
    price: 400,
    description: "+1 coin per step",
    effect: { type: "coin_per_step", value: 1 },
  },

  {
    key: "basic_compass",
    name: "Basic Compass",
    icon: "🧭",
    price: 300,
    description: "+5% spawn chance",
    effect: { type: "spawn_rate", value: 0.05 },
  },

  {
    key: "sticky_gloves",
    name: "Sticky Gloves",
    icon: "🧤",
    price: 500,
    description: "+5% catch chance",
    effect: { type: "catch_chance", value: 5 },
  },

  {
    key: "explorer_boots",
    name: "Explorer Boots",
    icon: "👢",
    price: 1500,
    description: "+2 coins per step",
    effect: { type: "coin_per_step", value: 2 },
  },

  {
    key: "coin_satchel",
    name: "Coin Satchel",
    icon: "💰",
    price: 1100,
    description: "+6 bonus coins every 20 steps",
    effect: { type: "coin_bonus_on_move", value: 6 },
  },

  {
    key: "hunter_compass",
    name: "Hunter Compass",
    icon: "🧭",
    price: 1400,
    description: "+12% spawn chance",
    effect: { type: "spawn_rate", value: 0.12 },
  },

  {
    key: "precision_net",
    name: "Precision Net",
    icon: "🕸️",
    price: 1600,
    description: "+12% catch chance",
    effect: { type: "catch_chance", value: 12 },
  },

  {
    key: "reinforced_exosuit",
    name: "Reinforced Exosuit",
    icon: "🦾",
    price: 4100,
    description: "+3 coins per step",
    effect: { type: "coin_per_step", value: 3 },
  },

  {
    key: "treasure_core",
    name: "Treasure Core",
    icon: "💎",
    price: 3800,
    description: "+15 bonus coins every 20 steps",
    effect: { type: "coin_bonus_on_move", value: 15 },
  },

  {
    key: "relic_radar",
    name: "Relic Radar",
    icon: "📡",
    price: 4000,
    description: "+22% spawn chance",
    effect: { type: "spawn_rate", value: 0.22 },
  },

  {
    key: "master_hunter_kit",
    name: "Master Hunter Kit",
    icon: "🎯",
    price: 4500,
    description: "+20% catch chance",
    effect: { type: "catch_chance", value: 20 },
  },

  {
    key: "golden_exoskeleton",
    name: "Golden Exoskeleton",
    icon: "👑",
    price: 11000,
    description: "+4 coins per step",
    effect: { type: "coin_per_step", value: 4 },
  },

  {
    key: "king_coin_engine",
    name: "King Coin Engine",
    icon: "⚙️",
    price: 9500,
    description: "+30 bonus coins every 20 steps",
    effect: { type: "coin_bonus_on_move", value: 30 },
  },

  {
    key: "dimensional_compass",
    name: "Dimensional Compass",
    icon: "🌌",
    price: 12000,
    description: "+35% spawn chance",
    effect: { type: "spawn_rate", value: 0.35 },
  },

  {
    key: "soul_harvester",
    name: "Soul Harvester",
    icon: "💀",
    price: 17000,
    description: "+30% catch chance",
    effect: { type: "catch_chance", value: 30 },
  },

  {
    key: "world_core",
    name: "World Core",
    icon: "🌍",
    price: 20000,
    description: "Extreme spawn dominance",
    effect: { type: "spawn_rate", value: 0.45 },
  },
];

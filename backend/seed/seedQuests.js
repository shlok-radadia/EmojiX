import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
import QuestCatalog from "../models/QuestCatalog.js";
import { questCatalogSeed } from "./questData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const quests = questCatalogSeed;

const seedQuests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await QuestCatalog.deleteMany();
    await QuestCatalog.insertMany(quests);

    console.log(`✅ Seeded ${quests.length} quests successfully`);
    process.exit();
  } catch (err) {
    console.error("❌ Quest seeding failed:", err);
    process.exit(1);
  }
};

seedQuests();
